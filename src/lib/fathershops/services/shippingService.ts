/**
 * FatherShops Shipping API Service.
 * Implements endpoints for Aramex shipping cities and FatherStock package tracking.
 */

import { fathershopsClient } from "../client";
import { FatherShopsApiResponse } from "../types";

export const shippingService = {
  /**
   * GET /shipping/cities?country_code={code}&term={term}
   * Retrieves shipping cities for Aramex integrations.
   */
  async getShippingCities(countryCode: string, term: string = ""): Promise<FatherShopsApiResponse<string[] | any[]>> {
    const query = new URLSearchParams();
    query.append("country_code", countryCode);
    if (term) query.append("term", term);

    return await fathershopsClient.request<string[] | any[]>(`shipping/cities?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * GET /extension/module/fatherstock_integration/fatherstock_tracking?tracking_code={code}&email={email}
   * Retrieves tracking details for a shipment.
   */
  async getShippingTracking(trackingCode: string, email: string): Promise<FatherShopsApiResponse<any>> {
    const query = new URLSearchParams();
    query.append("tracking_code", trackingCode);
    query.append("email", email);

    return await fathershopsClient.request<any>(
      `extension/module/fatherstock_integration/fatherstock_tracking?${query.toString()}`,
      { method: "GET" }
    );
  },
};
