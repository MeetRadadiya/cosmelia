/**
 * FatherShops Account / Customer API Service.
 * Wraps the account management endpoints discovered from the live FatherShops API.
 *
 * Authentication: All authenticated endpoints require `Authorization: Bearer <access_token>`
 * with the access token obtained from `POST /account/login` or `POST /account/register`.
 */

import { fathershopsClient } from "../client";
import {
  FatherShopsApiResponse,
  FatherShopsAuthResponse,
  FatherShopsCustomer,
  FatherShopsAddress,
  FatherShopsOrderSummary,
  FatherShopsWishlistData,
  FatherShopsNewsletterData,
  FatherShopsTrackerItem,
} from "../types";

const withAuth = (accessToken: string): Record<string, string> => ({
  Authorization: `Bearer ${accessToken}`,
});

export const accountService = {
  /**
   * POST /account/login
   * Authenticates a customer with email + password, returning JWT access/refresh tokens.
   */
  async login(email: string, password: string): Promise<FatherShopsApiResponse<FatherShopsAuthResponse>> {
    return await fathershopsClient.request<FatherShopsAuthResponse>("account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * POST /account/register
   * Creates a new customer account and returns an authenticated session.
   */
  async register(params: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirm: string;
    telephone?: string;
    agree?: boolean;
  }): Promise<FatherShopsApiResponse<FatherShopsAuthResponse>> {
    return await fathershopsClient.request<FatherShopsAuthResponse>("account/register", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  /**
   * GET /account/logout
   * Terminates the current customer session.
   */
  async logout(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/logout", {
      method: "GET",
    });
  },

  /**
   * GET /account/forgotten
   * Returns the forgot-password form state (public).
   */
  async getForgottenForm(): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/forgotten", {
      method: "GET",
    });
  },

  /**
   * POST /account/forgotten
   * Sends a password-reset email to the given address.
   */
  async requestPasswordReset(email: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/forgotten", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * GET /account/reset?code={code}
   * Validates a password-reset code and returns reset form state.
   */
  async validateResetCode(code: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`account/reset?code=${encodeURIComponent(code)}`, {
      method: "GET",
    });
  },

  /**
   * POST /account/reset
   * Resets the password using the provided code.
   */
  async resetPassword(code: string, password: string, confirm: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/reset", {
      method: "POST",
      body: JSON.stringify({ code, password, confirm }),
    });
  },

  // --------------------------------------------------------------------------
  // Profile
  // --------------------------------------------------------------------------

  /**
   * GET /account/edit
   * Returns authenticated customer profile fields.
   */
  async getProfile(accessToken: string): Promise<FatherShopsApiResponse<FatherShopsCustomer>> {
    return await fathershopsClient.request<FatherShopsCustomer>("account/edit", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/edit
   * Updates the customer's profile information.
   */
  async updateProfile(
    accessToken: string,
    params: { firstname?: string; lastname?: string; email?: string; telephone?: string }
  ): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/edit", {
      method: "POST",
      body: JSON.stringify(params),
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/password
   * Changes the customer's password.
   */
  async changePassword(accessToken: string, password: string, confirm: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/password", {
      method: "POST",
      body: JSON.stringify({ password, confirm }),
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * GET /account/newsletter
   * Returns the customer's newsletter subscription state.
   */
  async getNewsletter(accessToken: string): Promise<FatherShopsApiResponse<FatherShopsNewsletterData>> {
    return await fathershopsClient.request<FatherShopsNewsletterData>("account/newsletter", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/newsletter
   * Updates the customer's newsletter subscription.
   */
  async updateNewsletter(accessToken: string, subscribed: boolean): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/newsletter", {
      method: "POST",
      body: JSON.stringify({ newsletter: subscribed ? "1" : "0" }),
      customHeaders: withAuth(accessToken),
    });
  },

  // --------------------------------------------------------------------------
  // Addresses
  // --------------------------------------------------------------------------

  /**
   * GET /account/address
   * Lists the authenticated customer's saved addresses.
   */
  async getAddresses(accessToken: string): Promise<FatherShopsApiResponse<FatherShopsAddress[]>> {
    return await fathershopsClient.request<FatherShopsAddress[]>("account/address", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/address
   * Creates or updates a customer address.
   */
  async saveAddress(
    accessToken: string,
    address: Partial<FatherShopsAddress>
  ): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/address", {
      method: "POST",
      body: JSON.stringify(address),
      customHeaders: withAuth(accessToken),
    });
  },

  // --------------------------------------------------------------------------
  // Orders
  // --------------------------------------------------------------------------

  /**
   * GET /account/order
   * Returns the authenticated customer's order history.
   */
  async getOrders(
    accessToken: string,
    page: number = 1,
    limit: number = 20
  ): Promise<FatherShopsApiResponse<{ orders?: FatherShopsOrderSummary[]; order_total?: string | number }>> {
    return await fathershopsClient.request<{ orders?: FatherShopsOrderSummary[]; order_total?: string | number }>(
      `account/order?page=${page}&limit=${limit}`,
      {
        method: "GET",
        customHeaders: withAuth(accessToken),
      }
    );
  },

  /**
   * GET /account/order/info?order_id={id}
   * Returns details for a single order.
   */
  async getOrderDetail(accessToken: string, orderId: string | number): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>(`account/order/info?order_id=${encodeURIComponent(String(orderId))}`, {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  // --------------------------------------------------------------------------
  // Wishlist
  // --------------------------------------------------------------------------

  /**
   * GET /account/wishlist
   * Returns the customer's wishlist products.
   */
  async getWishlist(accessToken: string): Promise<FatherShopsApiResponse<FatherShopsWishlistData>> {
    return await fathershopsClient.request<FatherShopsWishlistData>("account/wishlist", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/wishlist
   * Adds or removes a product from the wishlist.
   */
  async toggleWishlist(
    accessToken: string,
    productId: string | number,
    add: boolean = true
  ): Promise<FatherShopsApiResponse<any>> {
    const endpoint = add ? "account/wishlist" : "account/wishlist/remove";
    return await fathershopsClient.request<any>(endpoint, {
      method: "POST",
      body: JSON.stringify({ product_id: String(productId) }),
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * POST /account/wishlist/remove
   * Removes a product from the wishlist.
   */
  async removeFromWishlist(accessToken: string, productId: string | number): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/wishlist/remove", {
      method: "POST",
      body: JSON.stringify({ product_id: String(productId) }),
      customHeaders: withAuth(accessToken),
    });
  },

  // --------------------------------------------------------------------------
  // Extended account features (transactions, rewards, etc.)
  // --------------------------------------------------------------------------

  /**
   * GET /account/transaction
   * Returns the customer's transaction history.
   */
  async getTransactions(accessToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/transaction", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * GET /account/reward
   * Returns the customer's reward points balance and history.
   */
  async getRewards(accessToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/reward", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * GET /account/recurring
   * Returns the customer's recurring payment/subscription data.
   */
  async getRecurring(accessToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/recurring", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  /**
   * GET /account/download
   * Returns the customer's digital downloads.
   */
  async getDownloads(accessToken: string): Promise<FatherShopsApiResponse<any>> {
    return await fathershopsClient.request<any>("account/download", {
      method: "GET",
      customHeaders: withAuth(accessToken),
    });
  },

  // --------------------------------------------------------------------------
  // Order Tracking (works for guests with email)
  // --------------------------------------------------------------------------

  /**
   * GET /extension/module/fatherstock_integration/fatherstock_tracking
   * Looks up a shipment by tracking code + email.
   */
  async trackOrder(trackingCode: string, email: string): Promise<FatherShopsApiResponse<FatherShopsTrackerItem>> {
    return await fathershopsClient.request<FatherShopsTrackerItem>(
      `extension/module/fatherstock_integration/fatherstock_tracking?tracking_code=${encodeURIComponent(
        trackingCode
      )}&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );
  },
};
