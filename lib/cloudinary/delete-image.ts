import cloudinary from "./cloudinary.config";
import { logger } from "@/lib/logger";

/**
 * Extracts Cloudinary public ID from a secure URL string.
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/");
    const filenameWithExt = parts.pop();
    const folder = parts.pop();
    if (!filenameWithExt || !folder) return null;
    const publicId = filenameWithExt.split(".")[0];
    return `${folder}/${publicId}`;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary by public ID or URL string.
 */
export async function deleteImage(publicIdOrUrl: string): Promise<boolean> {
  try {
    const publicId = publicIdOrUrl.startsWith("http")
      ? getPublicIdFromUrl(publicIdOrUrl)
      : publicIdOrUrl;

    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    logger.error("Cloudinary delete image failed", err);
    return false;
  }
}
