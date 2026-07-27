/**
 * File upload constants based on business rules (app.md §8 and SYSTEM_RULES.md).
 * Maximum 2 images per ticket/upload, URLs stored in MongoDB via Cloudinary.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"] as const;

export const MAX_IMAGE_COUNT = 2;

/**
 * Maximum file size in bytes (5 MB per image).
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
