import JSZip from "jszip";
import Papa from "papaparse";
import type { PlayerLevel, ProductCategory } from "../types/product";
import { formatTenisSize, usToMexicanSize } from "./shoeSize";

export interface ShopifyRow {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  Vendor: string;
  Type: string;
  Tags: string;
  "Option1 Name": string;
  "Option1 Value": string;
  "Variant SKU": string;
  "Variant Inventory Qty": string;
  "Variant Price": string;
  "Variant Compare At Price": string;
  "Image Src": string;
  "Image Position": string;
  [key: string]: string;
}

export interface ImportDraft {
  key: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  level: PlayerLevel | "";
  price: number;
  compareAtPrice: number | undefined;
  onSale: boolean;
  stock: number;
  sizes: string[];
  images: string[];
}

const TYPE_TO_CATEGORY: Record<string, ProductCategory> = {
  Pala: "palas",
  Zapatillas: "tenis",
  Camiseta: "ropa",
  Calcetines: "ropa",
  Gorra: "accesorios",
  Floky: "accesorios",
  Neceser: "mochilas",
};

const KNOWN_BRANDS = [
  "Nox",
  "Bullpadel",
  "Siux",
  "Adidas",
  "Lok",
  "Wilson",
  "Drop Shot",
  "Dropshot",
  "Head",
  "Babolat",
  "Vibora",
  "Joma",
  "StarVie",
  "Star Vie",
  "Asics",
  "Floky",
  "4on",
];

export async function readShopifyFile(file: File): Promise<ShopifyRow[]> {
  const isZip = file.name.toLowerCase().endsWith(".zip");
  const csvText = isZip ? await extractCsvFromZip(file) : await file.text();
  const result = Papa.parse<ShopifyRow>(csvText, { header: true, skipEmptyLines: true });
  return result.data;
}

async function extractCsvFromZip(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(file);
  const entry = Object.values(zip.files).find((item) => item.name.toLowerCase().endsWith(".csv"));
  if (!entry) throw new Error("El .zip no contiene un archivo .csv de productos.");
  return entry.async("text");
}

function detectCategory(type: string): ProductCategory {
  return TYPE_TO_CATEGORY[type.trim()] ?? "accesorios";
}

function detectBrand(tags: string, title: string): string {
  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  for (const tag of tagList) {
    const match = KNOWN_BRANDS.find((brand) => brand.toLowerCase() === tag.toLowerCase());
    if (match) return match;
  }

  const lowerTitle = title.toLowerCase();
  const match = KNOWN_BRANDS.find((brand) => lowerTitle.includes(brand.toLowerCase()));
  return match ?? "";
}

function detectLevel(rows: ShopifyRow[]): PlayerLevel | "" {
  for (const row of rows) {
    if (row["Option1 Name"] !== "Nivel") continue;
    const value = row["Option1 Value"].toLowerCase();
    if (value.includes("avanzado")) return "avanzado";
    if (value.includes("intermedio")) return "intermedio";
    if (value.includes("principiante") || value.includes("junior")) return "principiante";
  }
  return "";
}

function detectSizes(rows: ShopifyRow[], category: ProductCategory): string[] {
  const rawSizes = Array.from(
    new Set(
      rows
        .filter((row) => row["Option1 Name"] === "Talla" && row["Option1 Value"].trim())
        .map((row) => row["Option1 Value"].trim()),
    ),
  );
  if (rawSizes.length === 0) return [];

  if (category === "tenis") {
    return rawSizes.map((raw) => {
      const usMatch = raw.match(/([\d.]+)/);
      if (!usMatch) return raw;
      const us = usMatch[1];
      const mx = String(usToMexicanSize(Number(us)));
      return formatTenisSize({ us, mx });
    });
  }

  return rawSizes.map((size) => size.toUpperCase());
}

function stripHtml(html: string): string {
  const withBreaks = html.replace(/<\/p>|<br\s*\/?>/gi, "\n");
  const div = document.createElement("div");
  div.innerHTML = withBreaks;
  const text = div.textContent ?? "";
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function collectImages(rows: ShopifyRow[]): string[] {
  const withPosition = rows
    .filter((row) => row["Image Src"]?.trim())
    .map((row) => ({ src: row["Image Src"].trim(), position: Number(row["Image Position"]) || 0 }));

  const seen = new Set<string>();
  return withPosition
    .sort((a, b) => a.position - b.position)
    .filter((entry) => {
      if (seen.has(entry.src)) return false;
      seen.add(entry.src);
      return true;
    })
    .map((entry) => entry.src);
}

export function buildImportDrafts(rows: ShopifyRow[]): ImportDraft[] {
  const groups = new Map<string, ShopifyRow[]>();
  rows.forEach((row) => {
    const handle = row.Handle?.trim();
    if (!handle) return;
    const group = groups.get(handle);
    if (group) group.push(row);
    else groups.set(handle, [row]);
  });

  const drafts: ImportDraft[] = [];

  groups.forEach((groupRows, handle) => {
    const main = groupRows.find((row) => row.Title?.trim()) ?? groupRows[0];
    if (!main?.Title?.trim()) return;

    const category = detectCategory(main.Type);
    const price = Number(main["Variant Price"]) || 0;
    const compareAtPriceRaw = Number(main["Variant Compare At Price"]) || 0;
    const compareAtPrice = compareAtPriceRaw > price ? compareAtPriceRaw : undefined;
    const stock = groupRows.reduce((sum, row) => sum + (Number(row["Variant Inventory Qty"]) || 0), 0);

    drafts.push({
      key: handle,
      name: main.Title.trim(),
      description: stripHtml(main["Body (HTML)"] ?? ""),
      category,
      brand: detectBrand(main.Tags ?? "", main.Title),
      level: detectLevel(groupRows),
      price,
      compareAtPrice,
      onSale: Boolean(compareAtPrice),
      stock,
      sizes: detectSizes(groupRows, category),
      images: collectImages(groupRows),
    });
  });

  return drafts;
}
