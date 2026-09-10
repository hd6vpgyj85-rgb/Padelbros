export type ShoeGender = "hombre" | "mujer";

export interface TenisSizeRow {
  us: string;
  mx: string;
  gender: ShoeGender;
}

const MX_OFFSET: Record<ShoeGender, number> = {
  hombre: 18,
  mujer: 17,
};

const GENDER_LABEL: Record<ShoeGender, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
};

export function usToMexicanSize(us: number, gender: ShoeGender = "hombre"): number {
  return Math.round((us + MX_OFFSET[gender]) * 2) / 2;
}

export function formatTenisSize({ us, mx, gender }: TenisSizeRow): string {
  return `US ${us} (${GENDER_LABEL[gender]}) / MX ${mx}`;
}

const TENIS_SIZE_PATTERN = /US\s*([\d.]+)\s*\((Hombre|Mujer)\)\s*\/\s*MX\s*([\d.]+)/i;
const LEGACY_TENIS_SIZE_PATTERN = /US\s*([\d.]+)\s*\/\s*MX\s*([\d.]+)/i;

export function parseTenisSize(value: string): TenisSizeRow {
  const match = value.match(TENIS_SIZE_PATTERN);
  if (match) {
    const gender = match[2].toLowerCase() === "mujer" ? "mujer" : "hombre";
    return { us: match[1], mx: match[3], gender };
  }

  const legacyMatch = value.match(LEGACY_TENIS_SIZE_PATTERN);
  if (legacyMatch) {
    return { us: legacyMatch[1], mx: legacyMatch[2], gender: "hombre" };
  }

  return { us: value.trim(), mx: "", gender: "hombre" };
}
