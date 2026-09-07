/**
 * FatherShops Cart API Service.
 * Implements all endpoints tagged under 'Checkout/Cart' in the OpenAPI specification.
 */

import { fathershopsClient } from "../client";
import {
  FatherShopsRawCart,
  FatherShopsApiResponse,
} from "../types";

export interface AddToCartPayload {
  product_id: string | number;
  quantity?: number;
  option?: Record<string, any>;
}

export const cartService = {
  /**
   * GET /checkout/cart
   * Retrieves current session cart with products, totals, quantities, and weights.
   */
  async getCart(): Promise<FatherShopsApiResponse<FatherShopsRawCart>> {
    return await fathershopsClient.request<FatherShopsRawCart>("checkout/cart", {
      method: "GET",
    });
  },

  /**
   * POST /checkout/cart/add
   * Adds an item with quantity and options to the cart.
   */
  async addToCart(payload: AddToCartPayload): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/cart/add", {
      method: "POST",
      body: JSON.stringify({
        product_id: String(payload.product_id),
        quantity: payload.quantity || 1,
        option: payload.option || {},
      }),
    });
  },

  /**
   * POST /checkout/cart/edit
   * Edits quantity of an existing line item in the cart.
   * Body: { quantity: { [cart_key]: newQuantity } }
   */
  async editCart(quantityMap: Record<string, number>): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/cart/edit", {
      method: "POST",
      body: JSON.stringify({
        quantity: quantityMap,
      }),
    });
  },

  /**
   * POST /checkout/cart/remove
   * Removes an item from the cart by its line item key.
   * Body: { key: cart_key }
   */
  async removeFromCart(cartKey: string | number): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/cart/remove", {
      method: "POST",
      body: JSON.stringify({
        key: String(cartKey),
      }),
    });
  },

  /**
   * POST /extension/total/coupon/coupon
   * Applies a promo/coupon code to the current session cart.
   * Body: { coupon: couponCode }
   */
  async applyCoupon(couponCode: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("extension/total/coupon/coupon", {
      method: "POST",
      body: JSON.stringify({
        coupon: couponCode,
      }),
    });
  },

  /**
   * POST /checkout/cart_update
   * Journal3 cart update.
   */
  async journal3CartUpdate(data: any): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/cart_update", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /checkout/cart_delete
   * Journal3 cart delete.
   */
  async journal3CartDelete(data: any): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/cart_delete", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
