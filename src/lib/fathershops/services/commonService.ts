/**
 * FatherShops Common API Service.
 * Implements all endpoints tagged under 'common' in the OpenAPI specification.
 */

import { fathershopsClient } from "../client";
import {
  FatherShopsCommonData,
  FatherShopsCountry,
  FatherShopsZone,
  FatherShopsCity,
  FatherShopsCurrency,
  FatherShopsLanguage,
  FatherShopsApiResponse,
} from "../types";

export const commonService = {
  /**
   * GET /common/common
   * Initializes or returns session information, store brand, logo, and active settings.
   */
  async getCommonData(): Promise<FatherShopsApiResponse<FatherShopsCommonData>> {
    return await fathershopsClient.request<FatherShopsCommonData>("common/common", {
      method: "GET",
      skipSessionCheck: true,
    });
  },

  /**
   * GET /common/countries
   * Returns list of all available countries.
   */
  async getCountries(): Promise<FatherShopsApiResponse<FatherShopsCountry[]>> {
    return await fathershopsClient.request<FatherShopsCountry[]>("common/countries", {
      method: "GET",
    });
  },

  /**
   * GET /common/countries/{code}/zone
   * Returns zones/states for a given country code or ID.
   */
  async getCountryZones(countryCodeOrId: string | number): Promise<FatherShopsApiResponse<{ zone?: FatherShopsZone[] } | FatherShopsZone[]>> {
    return await fathershopsClient.request<{ zone?: FatherShopsZone[] } | FatherShopsZone[]>(
      `common/countries/${countryCodeOrId}/zone`,
      { method: "GET" }
    );
  },

  /**
   * GET /common/zone/{zone_code}
   * Returns details for a specific zone code.
   */
  async getZoneDetails(zoneCode: string | number): Promise<FatherShopsApiResponse<FatherShopsZone>> {
    return await fathershopsClient.request<FatherShopsZone>(`common/zone/${zoneCode}`, {
      method: "GET",
    });
  },

  /**
   * GET /common/zone/{zone_code}/city
   * Returns cities for a specific zone code.
   */
  async getZoneCities(zoneCode: string | number): Promise<FatherShopsApiResponse<FatherShopsCity[]>> {
    return await fathershopsClient.request<FatherShopsCity[]>(`common/zone/${zoneCode}/city`, {
      method: "GET",
    });
  },

  /**
   * GET /common/city/{city_id}
   * Returns details for a specific city ID.
   */
  async getCityDetails(cityId: string | number): Promise<FatherShopsApiResponse<FatherShopsCity>> {
    return await fathershopsClient.request<FatherShopsCity>(`common/city/${cityId}`, {
      method: "GET",
    });
  },

  /**
   * GET /common/currency
   * Lists all store currencies.
   */
  async getCurrencies(): Promise<FatherShopsApiResponse<FatherShopsCurrency[]>> {
    return await fathershopsClient.request<FatherShopsCurrency[]>("common/currency", {
      method: "GET",
    });
  },

  /**
   * GET /account/active-currencies
   * Lists active store currencies.
   */
  async getActiveCurrencies(): Promise<FatherShopsApiResponse<Record<string, FatherShopsCurrency>>> {
    return await fathershopsClient.request<Record<string, FatherShopsCurrency>>("account/active-currencies", {
      method: "GET",
    });
  },

  /**
   * POST /common/currency/currency
   * Updates shopper's active currency.
   */
  async updateCurrency(currencyCode: string): Promise<FatherShopsApiResponse<any>> {
    const formData = new URLSearchParams();
    formData.append("code", currencyCode);

    return await fathershopsClient.request<any>("common/currency/currency", {
      method: "POST",
      body: formData.toString(),
      customHeaders: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      isFormData: true,
    });
  },

  /**
   * GET /common/language
   * Lists all store languages.
   */
  async getLanguages(): Promise<FatherShopsApiResponse<FatherShopsLanguage[]>> {
    return await fathershopsClient.request<FatherShopsLanguage[]>("common/language", {
      method: "GET",
    });
  },

  /**
   * POST /common/language/language
   * Updates shopper's active language.
   */
  async updateLanguage(languageCode: string): Promise<FatherShopsApiResponse<any>> {
    const formData = new URLSearchParams();
    formData.append("code", languageCode);

    return await fathershopsClient.request<any>("common/language/language", {
      method: "POST",
      body: formData.toString(),
      customHeaders: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      isFormData: true,
    });
  },

  /**
   * GET /common/checkout_skins
   * Retrieves checkout skin and styling options.
   */
  async getCheckoutSkins(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("common/checkout_skins", {
      method: "GET",
    });
  },
};
