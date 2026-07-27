import { z } from "zod";
import mongoose from "mongoose";

/**
 * Zod validator for MongoDB ObjectId string.
 */
export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId format",
  });

/**
 * Helper function to validate if a value is a valid MongoDB ObjectId.
 */
export function isValidObjectId(id: unknown): id is string {
  if (typeof id !== "string" && !(id instanceof mongoose.Types.ObjectId)) {
    return false;
  }
  return mongoose.Types.ObjectId.isValid(String(id));
}
