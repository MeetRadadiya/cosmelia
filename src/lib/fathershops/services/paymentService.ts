/**
 * FatherShops Payment API Service.
 * Implements FatherPay gateway endpoints and payment confirmation workflows.
 */

import { fathershopsClient } from "../client";
import { FatherShopsApiResponse } from "../types";

export const paymentService = {
  /**
   * GET /checkout/payment
   * Retrieves payment form HTML and asset scripts.
   */
  async getPaymentHtml(
    locale: string = "en",
  ): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(
      `checkout/payment?locale=${encodeURIComponent(locale)}`,
      {
        method: "GET",
      },
    );
  },

  /**
   * POST /checkout/paymentConfirm
   * Confirms a payment transaction with the checkout_id.
   */
  async confirmPayment(
    checkoutId: string,
  ): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("checkout/paymentConfirm", {
      method: "POST",
      body: JSON.stringify({ checkout_id: checkoutId }),
    });
  },

  /**
   * POST /extension/payment/fatherpay_dropship/confirm&webhook=true&json=true
   * Server webhook confirmation for FatherPay dropship transactions.
   */
  async confirmPaymentWebhook(
    payload: any,
  ): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(
      "extension/payment/fatherpay_dropship/confirm&webhook=true&json=true",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * GET /extension/payment/fatherpay_dropship/confirm
   * Confirmation check for FatherPay transactions.
   */
  async getPaymentConfirm(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(
      "extension/payment/fatherpay_dropship/confirm",
      {
        method: "GET",
      },
    );
  },

  /**
   * GET /extension/payment/fatherpay_dropship/dummy
   * FatherPay dummy/test transaction endpoint.
   */
  async getDummyPayment(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(
      "extension/payment/fatherpay_dropship/dummy",
      {
        method: "GET",
      },
    );
  },
};
