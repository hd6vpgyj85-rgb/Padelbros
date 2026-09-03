import { supabase } from "../lib/supabaseClient";

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.82;

function resizeImageToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("No se pudo procesar la imagen."));
      image.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("No se pudo procesar la imagen."));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          JPEG_QUALITY,
        );
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function randomFileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export type ImageBucket = "product-images" | "review-images";

export async function uploadImage(file: File, bucket: ImageBucket): Promise<string> {
  const blob = await resizeImageToBlob(file);
  const path = `${randomFileId()}.jpg`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600" });

  if (error) throw new Error("No se pudo subir la imagen.");

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
