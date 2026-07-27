import mongoose, { Schema } from "mongoose";
import { ALL_TOOL_CATEGORIES } from "@/constants/tool-category";
import type { ITool, ToolModel } from "@/types/tool.types";

/**
 * Tool (Công cụ dụng cụ — CCDC) — app.md §5.
 *
 * Covers tools, materials, and equipment used in maintenance work.
 * Future expansion: track usage per RepairTicket.
 *
 * Images are stored as Cloudinary URLs — never binary data.
 *
 * Indexes:
 *   - toolCode: unique — tool codes are globally unique.
 *   - category: for filtering by type.
 *   - isActive: for listing active inventory.
 */
const toolSchema = new Schema<ITool>(
  {
    toolCode: {
      type: String,
      required: [true, "Tool code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    toolName: {
      type: String,
      required: [true, "Tool name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Tool category is required"],
      enum: {
        values: ALL_TOOL_CATEGORIES,
        message: `Category must be one of: ${ALL_TOOL_CATEGORIES.join(", ")}`,
      },
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    unit: {
      type: String,
      trim: true,
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    // Cloudinary URL for the tool's reference image
    imageUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "tools",
  }
);

toolSchema.index({ toolCode: 1 }, { unique: true });
toolSchema.index({ category: 1 });
toolSchema.index({ isActive: 1 });
toolSchema.index({ category: 1, isActive: 1 });

const Tool =
  (mongoose.models.Tool as ToolModel) ||
  mongoose.model<ITool, ToolModel>("Tool", toolSchema);

export default Tool;
