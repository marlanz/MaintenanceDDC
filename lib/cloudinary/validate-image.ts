import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_COUNT,
  MAX_FILE_SIZE_BYTES,
} from "@/constants/upload";
import { ValidationError } from "@/lib/errors";

export interface ImageInput {
  name: string;
  size: number;
  type: string;
}

/**
 * Validates a single image file or batch of image files according to business rules.
 * Business rules: Max 2 images, formats: PNG/JPG/JPEG, max 5MB size.
 */
export function validateImages(images: ImageInput[]): void {
  if (images.length > MAX_IMAGE_COUNT) {
    throw new ValidationError(
      `Maximum ${MAX_IMAGE_COUNT} images allowed per upload.`
    );
  }

  for (const img of images) {
    if (!ALLOWED_IMAGE_TYPES.includes(img.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      throw new ValidationError(
        `Invalid format for "${img.name}". Only PNG, JPG, and JPEG are allowed.`
      );
    }

    if (img.size > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(
        `File "${img.name}" exceeds the maximum allowed size of 5MB.`
      );
    }
  }
}
