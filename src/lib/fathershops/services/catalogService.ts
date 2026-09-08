/**
 * FatherShops Catalog API Service.
 * Implements all endpoints tagged under 'catalog' in the OpenAPI specification.
 */

import { fathershopsClient } from "../client";
import {
  FatherShopsRawProduct,
  FatherShopsRawCategory,
  FatherShopsApiResponse,
} from "../types";

export interface CatalogQueryParams {
  category_id?: string | number;
  sort?: string;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  filter?: string;
}

export const catalogService = {
  /**
   * GET /product/catalog
   * Lists products with filtering, sorting, and pagination.
   */
  async getProducts(params: CatalogQueryParams = {}): Promise<FatherShopsApiResponse<{ products?: FatherShopsRawProduct[]; total?: number }>> {
    const query = new URLSearchParams();
    if (params.category_id) {
      query.append("filter_category_id", String(params.category_id));
      query.append("category_id", String(params.category_id));
    }
    if (params.sort) query.append("sort", params.sort);
    if (params.order) query.append("order", params.order);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.filter) query.append("filter", params.filter);

    const queryString = query.toString();
    const endpoint = queryString ? `product/catalog?${queryString}` : "product/catalog";

    return await fathershopsClient.request<{ products?: FatherShopsRawProduct[]; total?: number }>(endpoint, {
      method: "GET",
    });
  },

  /**
   * GET /product/platform/catalog
   * Lists platform catalog products.
   */
  async getPlatformProducts(params: CatalogQueryParams = {}): Promise<FatherShopsApiResponse<{ products?: FatherShopsRawProduct[] }>> {
    const query = new URLSearchParams();
    if (params.category_id) query.append("category_id", String(params.category_id));
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString ? `product/platform/catalog?${queryString}` : "product/platform/catalog";

    return await fathershopsClient.request<{ products?: FatherShopsRawProduct[] }>(endpoint, {
      method: "GET",
    });
  },

  /**
   * GET /product/{product_id}
   * Retrieves full details, images, options, and attributes for a product.
   */
  async getProductDetails(productId: string | number): Promise<FatherShopsApiResponse<FatherShopsRawProduct>> {
    return await fathershopsClient.request<FatherShopsRawProduct>(`product/${productId}`, {
      method: "GET",
    });
  },

  /**
   * GET /product/category
   * Retrieves the complete store category tree.
   */
  async getCategoryTree(): Promise<FatherShopsApiResponse<FatherShopsRawCategory[]>> {
    return await fathershopsClient.request<FatherShopsRawCategory[]>("product/category", {
      method: "GET",
    });
  },

  /**
   * GET /product/platform/category
   * Retrieves the platform category tree.
   */
  async getPlatformCategoryTree(): Promise<FatherShopsApiResponse<FatherShopsRawCategory[]>> {
    return await fathershopsClient.request<FatherShopsRawCategory[]>("product/platform/category", {
      method: "GET",
    });
  },

  /**
   * GET /product/category/{category_id}
   * Retrieves specific category details.
   */
  async getCategory(categoryId: string | number): Promise<FatherShopsApiResponse<FatherShopsRawCategory>> {
    return await fathershopsClient.request<FatherShopsRawCategory>(`product/category/${categoryId}`, {
      method: "GET",
    });
  },

  /**
   * POST /search
   * Performs full-text catalog search.
   */
  async search(query: string, options: { category_id?: string | number; sub_category?: boolean; description?: boolean } = {}): Promise<FatherShopsApiResponse<{ products?: FatherShopsRawProduct[] }>> {
    return await fathershopsClient.request<{ products?: FatherShopsRawProduct[] }>("search", {
      method: "POST",
      body: JSON.stringify({
        search: query,
        category_id: options.category_id ? String(options.category_id) : "0",
        sub_category: options.sub_category ? "1" : "0",
        description: options.description ? "1" : "0",
      }),
    });
  },
};
