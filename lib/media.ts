import { existsSync } from "node:fs";
import path from "node:path";

export function imageFilePresent(src: string): boolean {
  const relative = src.replace(/^\/+/, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}

export function presentImages<T extends { src: string; webp?: string }>(images: T[]): T[] {
  return images.flatMap((image) => {
    if (!imageFilePresent(image.src)) return [];
    if (image.webp && !imageFilePresent(image.webp)) {
      return [{ ...image, webp: undefined }];
    }
    return [image];
  });
}
