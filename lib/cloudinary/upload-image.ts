import cloudinary from "./cloudinary.config";
import { BusinessError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Uploads a base64 encoded image string or file buffer to Cloudinary.
 * Returns only the secure HTTP URL string.
 */
export async function uploadImage(
  fileBase64OrUrl: string,
  folder = "maintenance-ddc"
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(fileBase64OrUrl, {
      folder,
      resource_type: "image",
      allowed_formats: ["png", "jpg", "jpeg"],
    });

    return result.secure_url;
  } catch (err) {
    logger.error("Cloudinary image upload failed", err);
    throw new BusinessError(
      "Failed to upload image. Please try again.",
      "CLOUDINARY_UPLOAD_FAILED"
    );
  }
}
