/**
 * Official FatherShops Commerce Provider Adapter.
 * Integrates FatherShops API directly into the application's CommerceProvider interface.
 */

import { CommerceProvider } from "../commerce/provider";
import {
  Product,
  Category,
  Cart,
  Customer,
  Order,
  ProductFilterParams,
  ProductListResult,
  CheckoutResult,
} from "../commerce/types";
import { catalogService } from "./services/catalogService";
import { cartService } from "./services/cartService";
import { checkoutService } from "./services/checkoutService";
import { normalizeProduct, normalizeCategory, normalizeCart } from "./mappers";
import { getFatherShopsConfig } from "./config";

export class FatherShopsCommerceProvider implements CommerceProvider {
  public name = "FatherShops";
  public isOfficialIntegration = true;

  constructor() {
    const config = getFatherShopsConfig();
    if (!config.isConfigured && process.env.NODE_ENV === "development") {
      console.warn("[FatherShops] Configuration missing FATHERSHOP_API_BASE_URL or FATHERSHOP_TENANT.");
    }
  }

  // --------------------------------------------------------------------------
  // Catalog
  // --------------------------------------------------------------------------

  async getProducts(params: ProductFilterParams = {}): Promise<ProductListResult> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 12;

      let sort: string | undefined;
      let order: "ASC" | "DESC" = "DESC";

      if (params.sort) {
        switch (params.sort) {
          case "price-asc":
            sort = "p.price";
            order = "ASC";
            break;
          case "price-desc":
            sort = "p.price";
            order = "DESC";
            break;
          case "rating":
            sort = "rating";
            order = "DESC";
            break;
          case "featured":
          case "newest":
          default:
            sort = "p.date_added";
            order = "DESC";
            break;
        }
      }

      const res = await catalogService.getProducts({
        category_id: params.categorySlug,
        page,
        limit,
        sort,
        order,
      });

      const rawProducts = res.data?.products || [];
      const products = rawProducts.map(normalizeProduct);
      const total = res.data?.total || products.length;

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (err: any) {
      console.error("[FatherShops Provider] getProducts error:", err.message);
      return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    }
  }

  async getProduct(slugOrId: string): Promise<Product | null> {
    try {
      // 1. Check if slugOrId is a direct numeric ID
      let productId = slugOrId;

      if (!/^\d+$/.test(productId)) {
        // Try extracting trailing ID: e.g. "bioaqua-eye-mask-59" -> "59"
        const match = slugOrId.match(/-(\d+)$/);
        if (match) {
          productId = match[1];
        } else {
          // If purely textual slug, search catalog for matching product
          const searchRes = await catalogService.search(slugOrId.replace(/-/g, " "));
          const found = (searchRes.data?.products || []).find(
            (p) => normalizeProduct(p).slug === slugOrId
          );
          if (found) {
            productId = String(found.product_id || found.id);
          }
        }
      }

      const res = await catalogService.getProductDetails(productId);
      if (res.data) {
        return normalizeProduct(res.data);
      }
      return null;
    } catch (err: any) {
      console.error(`[FatherShops Provider] getProduct('${slugOrId}') error:`, err.message);
      return null;
    }
  }

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    const list = await this.getProducts({ limit, sort: "featured" });
    return list.products.slice(0, limit);
  }

  async getBestSellers(limit: number = 4): Promise<Product[]> {
    const list = await this.getProducts({ limit, sort: "rating" });
    return list.products.slice(0, limit);
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const res = await catalogService.getProductDetails(productId);
      if (res.data?.products && res.data.products.length > 0) {
        return res.data.products.slice(0, limit).map(normalizeProduct);
      }
    } catch {
      // Ignore
    }
    const list = await this.getProducts({ limit: limit + 1 });
    return list.products.filter((p) => p.id !== productId).slice(0, limit);
  }

  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    try {
      const res = await catalogService.search(query);
      const products = (res.data?.products || []).map(normalizeProduct);
      return products.slice(0, limit);
    } catch (err: any) {
      console.error("[FatherShops Provider] searchProducts error:", err.message);
      return [];
    }
  }

  // --------------------------------------------------------------------------
  // Categories
  // --------------------------------------------------------------------------

  async getCategories(): Promise<Category[]> {
    try {
      const res = await catalogService.getCategoryTree();
      const raw = Array.isArray(res.data) ? res.data : [];
      return raw.map(normalizeCategory);
    } catch (err: any) {
      console.error("[FatherShops Provider] getCategories error:", err.message);
      return [];
    }
  }

  async getCategory(slugOrId: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      const found = categories.find((c) => c.slug === slugOrId || c.id === slugOrId);
      if (found) return found;

      if (/^\d+$/.test(slugOrId)) {
        const res = await catalogService.getCategory(slugOrId);
        if (res.data) return normalizeCategory(res.data);
      }
      return null;
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // Cart
  // --------------------------------------------------------------------------

  async getCart(): Promise<Cart> {
    try {
      const res = await cartService.getCart();
      if (res.data) {
        return normalizeCart(res.data);
      }
    } catch (err: any) {
      console.error("[FatherShops Provider] getCart error:", err.message);
    }
    return normalizeCart({});
  }

  async addToCart(_cartId: string, item: { productId: string; variantId?: string; quantity: number }): Promise<Cart> {
    try {
      const option: Record<string, any> = {};
      if (item.variantId) {
        // Look up option ID or pass variant
        option[item.variantId] = item.variantId;
      }

      await cartService.addToCart({
        product_id: item.productId,
        quantity: item.quantity,
        option,
      });

      return await this.getCart();
    } catch (err: any) {
      console.error("[FatherShops Provider] addToCart error:", err.message);
      throw err;
    }
  }

  async updateCartItem(_cartId: string, lineItemId: string, quantity: number): Promise<Cart> {
    try {
      await cartService.editCart({ [lineItemId]: quantity });
      return await this.getCart();
    } catch (err: any) {
      console.error("[FatherShops Provider] updateCartItem error:", err.message);
      throw err;
    }
  }

  async removeCartItem(_cartId: string, lineItemId: string): Promise<Cart> {
    try {
      await cartService.removeFromCart(lineItemId);
      return await this.getCart();
    } catch (err: any) {
      console.error("[FatherShops Provider] removeCartItem error:", err.message);
      throw err;
    }
  }

  async clearCart(_cartId: string): Promise<Cart> {
    try {
      const current = await this.getCart();
      for (const item of current.items) {
        await cartService.removeFromCart(item.id);
      }
      return await this.getCart();
    } catch {
      return normalizeCart({});
    }
  }

  // --------------------------------------------------------------------------
  // Checkout
  // --------------------------------------------------------------------------

  async createCheckout(_cartId: string): Promise<CheckoutResult> {
    try {
      const tokenRes = await checkoutService.getCheckoutToken();
      const token = tokenRes.data?.token;

      return {
        url: token ? `/checkout?checkout_token=${encodeURIComponent(token)}` : "/checkout",
        requiresRedirect: true,
        sessionId: token,
        providerStatus: "supported",
        message: "FatherShops checkout initiated",
      };
    } catch {
      return {
        url: "/checkout",
        requiresRedirect: true,
        providerStatus: "supported",
      };
    }
  }

  // --------------------------------------------------------------------------
  // Customer & Orders
  // --------------------------------------------------------------------------

  async getCustomer(_token?: string): Promise<Customer | null> {
    return null;
  }

  async getCustomerOrders(_token?: string): Promise<Order[]> {
    return [];
  }
}
