/**
 * FatherShops Checkout API Service.
 * Implements all endpoints tagged under 'Checkout' and 'Checkout/Share & Handoff' in the OpenAPI specification.
 */

import { fathershopsClient } from "../client";
import {
  FatherShopsCheckoutInitData,
  FatherShopsOrderData,
  FatherShopsApiResponse,
} from "../types";

export const checkoutService = {
  /**
   * GET /checkout/init
   * Initializes checkout, returning shipping methods, payment methods, customer data, and checkout_id.
   * Optionally accepts a checkout_token to restore a minted/shared session.
   */
  async initCheckout(checkoutToken?: string): Promise<FatherShopsApiResponse<FatherShopsCheckoutInitData>> {
    const endpoint = checkoutToken ? `checkout/init?checkout_token=${encodeURIComponent(checkoutToken)}` : "checkout/init";
    return await fathershopsClient.request<FatherShopsCheckoutInitData>(endpoint, {
      method: "GET",
    });
  },

  /**
   * POST /checkout/save
   * Persists checkout form state as the shopper fills it in. Debounced.
   * The Journal3 controller requires checkout_id at the TOP level of the payload,
   * matching the id returned by /checkout/init. Omitting it makes the server
   * answer "Checkout id mismatch" and no order is staged.
   */
  async saveCheckout(orderData: Partial<FatherShopsOrderData>, checkoutId?: string): Promise<FatherShopsApiResponse<any>> {
    const body: Record<string, unknown> = { order_data: orderData };
    if (checkoutId) body.checkout_id = checkoutId;
    return await fathershopsClient.request<any>("checkout/save", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * POST /checkout/save&confirm=true
   * Places the order. Same controller as Save with confirm=true.
   * checkout_id must be sent at the TOP level (see saveCheckout).
   */
  async confirmOrder(
    orderData: Partial<FatherShopsOrderData>,
    agree: boolean = true,
    privacy: boolean = true,
    checkoutId?: string
  ): Promise<FatherShopsApiResponse<any>> {
    const body: Record<string, unknown> = {
      order_data: orderData,
      agree,
      privacy,
    };
    if (checkoutId) body.checkout_id = checkoutId;
    return await fathershopsClient.request<any>("checkout/save&confirm=true", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * POST /checkout/telephone
   * Updates signed-in or checkout customer telephone number and country code.
   */
  async saveTelephone(telephone: string, telephoneCountryCode: string = ""): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/telephone", {
      method: "POST",
      body: JSON.stringify({
        telephone,
        telephone_country_code: telephoneCountryCode,
      }),
    });
  },

  /**
   * GET /checkout/payment
   * Retrieves selected gateway's rendered HTML form and assets.
   */
  async getPaymentHtml(locale: string = "en"): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`checkout/payment?locale=${encodeURIComponent(locale)}`, {
      method: "GET",
    });
  },

  /**
   * POST /checkout/paymentConfirm
   * Confirms payment for the given checkout_id.
   */
  async confirmPayment(checkoutId: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/paymentConfirm", {
      method: "POST",
      body: JSON.stringify({
        checkout_id: checkoutId,
      }),
    });
  },

  /**
   * GET /checkout/confirm
   * Enhanced checkout confirmation step.
   */
  async getConfirm(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/confirm", {
      method: "GET",
    });
  },

  /**
   * GET /checkout/success?order_id={order_id}
   * Retrieves order success payload and confirmation summary.
   */
  async getOrderSuccess(orderId: string | number): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`checkout/success?order_id=${encodeURIComponent(String(orderId))}`, {
      method: "GET",
    });
  },

  /**
   * GET /checkout/getToken
   * Mints a checkout token for sharing or handoff.
   */
  async getCheckoutToken(authCustomer: boolean = false): Promise<FatherShopsApiResponse<{ token: string; expires_in?: number; customer_id?: string }>> {
    const endpoint = authCustomer ? "checkout/getToken&auth_customer=true" : "checkout/getToken";
    return await fathershopsClient.request<{ token: string; expires_in?: number; customer_id?: string }>(endpoint, {
      method: "GET",
    });
  },

  /**
   * GET /checkout/fetchByToken?checkout_token={token}
   * Resolves a minted token and pins the session/cookies.
   */
  async fetchByToken(checkoutToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`checkout/fetchByToken?checkout_token=${encodeURIComponent(checkoutToken)}`, {
      method: "GET",
    });
  },

  /**
   * GET /store_url/c/{checkout_token}
   * Shared cart link resolver endpoint.
   */
  async openSharedCartLink(checkoutToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`store_url/c/${encodeURIComponent(checkoutToken)}`, {
      method: "GET",
    });
  },
};
