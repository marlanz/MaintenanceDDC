import type { Document, Model } from "mongoose";
import type { ToolCategoryType } from "@/constants/tool-category";

/**
 * Tool (Công cụ dụng cụ — CCDC) business entity — app.md §5.
 *
 * Covers three sub-types:
 *  - Công cụ (TOOL)
 *  - Vật tư (MATERIAL)
 *  - Thiết bị (EQUIPMENT)
 *
 * Tracking usage in repair tickets is planned for future expansion.
 * Image URLs are stored from Cloudinary, never binary data.
 */
export interface ITool {
  toolCode: string;
  toolName: string;
  category: ToolCategoryType;
  description?: string;
  unit?: string;
  /** Current stock quantity */
  quantity: number;
  /** Cloudinary URL for the tool's reference image */
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ToolDocument = ITool & Document;

export type ToolModel = Model<ITool>;
