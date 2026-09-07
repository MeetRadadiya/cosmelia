/**
 * FatherShops Language API Service.
 * Implements endpoints tagged under 'language' in the OpenAPI specification.
 */

import { fathershopsClient } from "../client";
import { FatherShopsApiResponse } from "../types";

export const languageService = {
  /**
   * GET /language
   * Retrieves global language string translations.
   */
  async getLanguageStrings(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("language", {
      method: "GET",
    });
  },

  /**
   * GET /language/checkout
   * Retrieves checkout specific translations.
   */
  async getCheckoutLanguage(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("language/checkout", {
      method: "GET",
    });
  },

  /**
   * GET /language/account
   * Retrieves customer account translations.
   */
  async getAccountLanguage(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("language/account", {
      method: "GET",
    });
  },

  /**
   * GET /language/product
   * Retrieves product page translations.
   */
  async getProductLanguage(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("language/product", {
      method: "GET",
    });
  },
};
