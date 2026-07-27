import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_COUNT,
  MAX_FILE_SIZE_BYTES,
} from "@/constants/upload";

export const uploadFileSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(MAX_FILE_SIZE_BYTES, "File size must not exceed 5MB"),
  type: z.enum(ALLOWED_IMAGE_TYPES, {
    error: "File format must be png, jpg, or jpeg",
  }),
});

export const imageUploadBatchSchema = z
  .array(uploadFileSchema)
  .max(MAX_IMAGE_COUNT, `Maximum ${MAX_IMAGE_COUNT} files allowed`);

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type ImageUploadBatchInput = z.infer<typeof imageUploadBatchSchema>;
