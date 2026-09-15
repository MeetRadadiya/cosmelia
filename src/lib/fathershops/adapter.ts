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

      // Resolve a human-readable category slug/numeric id to the numeric category ID
      // the API expects (e.g. "pimple-patches-21" -> "21").
      let categoryId: string | number | undefined = params.categorySlug;
      if (typeof categoryId === "string" && !/^\d+$/.test(categoryId)) {
        const categories = await this.getCategories();
        const match = categories.find((c) => c.slug === categoryId) || (() => {
          const trailing = categoryId.match(/-(\d+)$/);
          return trailing ? categories.find((c) => c.id === trailing[1]) : undefined;
        })();
        categoryId = match?.id ?? categoryId;
      }

      const res = await catalogService.getProducts({
        category_id: categoryId,
        page,
        limit,
        sort,
        order,
      });

      const rawProducts = res.data?.products || [];
      let products = rawProducts.map(normalizeProduct);

      // Perform strict client-side category filtering if categorySlug was specified
      if (params.categorySlug) {
        const catSlug = params.categorySlug.toLowerCase();
        const catIdStr = String(categoryId || "");
        const filtered = products.filter((p) => {
          return (
            p.categoryId === catIdStr ||
            p.categorySlug === catSlug ||
            p.category.toLowerCase().replace(/\s+/g, "-") === catSlug ||
            p.category.toLowerCase().includes(catSlug.replace(/-\d+$/, "").replace(/-/g, " "))
          );
        });
        if (filtered.length > 0) {
          products = filtered;
        }
      }

      const total = products.length;

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
      let productId = slugOrId;

      if (!/^\d+$/.test(productId)) {
        const match = slugOrId.match(/-(\d+)$/);
        if (match) {
          productId = match[1];
        }
      }

      // 1. Try direct API endpoint GET /product/{productId}
      try {
        const res = await catalogService.getProductDetails(productId);
        if (res.data) {
          // If res.data is wrapped in { products: [...] } without top-level product_id, unwrap it.
          // Otherwise, res.data is the product itself (res.data.products represents related items).
          let rawProduct: any = res.data;
          if (!rawProduct.product_id && Array.isArray(rawProduct.products) && rawProduct.products.length > 0) {
            rawProduct = rawProduct.products[0];
          }
          if (rawProduct && (rawProduct.product_id || rawProduct.id || rawProduct.name || rawProduct.descriptions)) {
            return normalizeProduct(rawProduct);
          }
        }
      } catch {
        // Fallthrough to catalog lookup
      }

      // 2. Fallback: Lookup in catalog list
      const catalogRes = await this.getProducts({ limit: 50 });
      const found = catalogRes.products.find(
        (p) => p.id === productId || p.slug === slugOrId || p.slug.endsWith(`-${productId}`)
      );
      if (found) return found;

      return null;
    } catch (err: any) {
      console.error("[FatherShops Provider] getProduct error:", err.message);
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

  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const cleanQ = query.trim().toLowerCase();
      if (!cleanQ) return [];

      const res = await catalogService.search(query);
      let products = (res.data?.products || []).map(normalizeProduct);

      if (products.length === 0) {
        const allResult = await this.getProducts({ limit: 50 });
        products = allResult.products.filter((p) => {
          return (
            p.name.toLowerCase().includes(cleanQ) ||
            p.category.toLowerCase().includes(cleanQ) ||
            (p.tagline && p.tagline.toLowerCase().includes(cleanQ)) ||
            (p.description && p.description.toLowerCase().includes(cleanQ)) ||
            (p.sku && p.sku.toLowerCase().includes(cleanQ))
          );
        });
      }

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
