/**
 * FatherShops Compare API Service.
 * 
 * Handles adding and removing products from the FatherShops backend compare session.
 */

import { fathershopsClient } from "../client";
import { FatherShopsApiResponse } from "../types";

export interface CompareAddResponse {
  success?: string;
  notification?: {
    className?: string;
    position?: string;
    title?: string;
    image?: string;
    image2x?: string;
    message?: string;
  };
  count?: number;
  total?: string;
}

export const compareService = {
  /**
   * POST /product/compare/add
   * Adds a product to the backend compare session.
   */
  async addToCompare(productId: string | number): Promise<FatherShopsApiResponse<CompareAddResponse>> {
    try {
      return await fathershopsClient.request<CompareAddResponse>("product/compare/add", {
        method: "POST",
        body: JSON.stringify({ product_id: String(productId) }),
      });
    } catch (err: any) {
      console.warn("[FatherShops compareService] addToCompare warning:", err.message);
      return { data: {}, errors: [err.message], code: 200 };
    }
  },

  /**
   * GET /product/compare?remove={productId}
   * Removes a product from the backend compare session.
   */
  async removeFromCompare(productId: string | number): Promise<FatherShopsApiResponse<any>> {
    try {
      return await fathershopsClient.request<any>(`product/compare?remove=${productId}`, {
        method: "GET",
      });
    } catch (err: any) {
      console.warn("[FatherShops compareService] removeFromCompare warning:", err.message);
      return { data: {}, errors: [err.message], code: 200 };
    }
  },
};
