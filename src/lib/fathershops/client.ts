/**
 * Centralized FatherShops API Client & Interceptor.
 * 
 * Complies with the OpenAPI Specification:
 * - Injects X-Tenant, x-platform, x-session-id, x-domain, Authorization.
 * - Handles non-JSON / HTML responses (e.g. store_not_found).
 * - Inspects HTTP 200 application-level errors (errors[], data.error).
 * - Implements automatic session initialization & recovery.
 * - Sanitized development logging (no tokens or credentials in logs).
 */

import { getFatherShopsConfig, FatherShopsConfig } from "./config";
import { FatherShopsApiResponse } from "./types";

export class FatherShopsApiError extends Error {
  public code: number;
  public details: any;
  public endpoint: string;

  constructor(message: string, code: number = 500, details?: any, endpoint: string = "") {
    super(message);
    this.name = "FatherShopsApiError";
    this.code = code;
    this.details = details;
    this.endpoint = endpoint;
  }
}

// Memory session cache (persisted to localStorage in browser environments)
let cachedSessionId: string | null = null;

export class FatherShopsClient {
  private config: FatherShopsConfig;

  constructor() {
    this.config = getFatherShopsConfig();
  }

  public getSessionId(): string | null {
    if (this.config.sessionId) {
      return this.config.sessionId;
    }
    if (cachedSessionId) {
      return cachedSessionId;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fathershop_session_id");
        if (stored) {
          cachedSessionId = stored;
          return stored;
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return null;
  }

  public setSessionId(id: string) {
    cachedSessionId = id;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fathershop_session_id", id);
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  public clearSession() {
    cachedSessionId = null;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("fathershop_session_id");
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Initializes or recovers the session ID from common/common if not already available.
   */
  public async ensureSession(): Promise<string> {
    const existing = this.getSessionId();
    if (existing) {
      return existing;
    }

    try {
      const res = await this.rawRequest<{ session_id: string }>("common/common", {
        method: "GET",
        skipSessionCheck: true,
      });

      if (res.data && res.data.session_id) {
        this.setSessionId(res.data.session_id);
        return res.data.session_id;
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[FatherShopsClient] Failed to initialize session from common/common:", err);
      }
    }

    return "";
  }

  /**
   * Central request method with auto-session recovery, safe non-JSON parsing, and error normalization.
   */
  public async request<T = any>(
    endpoint: string,
    options: RequestInit & {
      skipSessionCheck?: boolean;
      isFormData?: boolean;
      customHeaders?: Record<string, string>;
      retryCount?: number;
    } = {}
  ): Promise<FatherShopsApiResponse<T>> {
    // Ensure session exists for cart/checkout requests
    const isCartOrCheckout =
      endpoint.startsWith("checkout/") ||
      endpoint.startsWith("extension/total/coupon") ||
      endpoint.startsWith("extension/payment");

    if (isCartOrCheckout && !this.getSessionId() && !options.skipSessionCheck) {
      await this.ensureSession();
    }

    try {
      return await this.rawRequest<T>(endpoint, options);
    } catch (error) {
      // Session recovery retry: if session missing or expired, re-fetch common/common once
      if (
        isCartOrCheckout &&
        (options.retryCount || 0) < 1 &&
        error instanceof FatherShopsApiError &&
        (error.message.toLowerCase().includes("session") || error.code === 401 || error.code === 403)
      ) {
        this.clearSession();
        await this.ensureSession();
        return await this.request<T>(endpoint, {
          ...options,
          retryCount: (options.retryCount || 0) + 1,
        });
      }
      throw error;
    }
  }

  /**
   * Low-level fetch wrapper handling headers, parsing, and application-level errors.
   */
  private async rawRequest<T = any>(
    endpoint: string,
    options: RequestInit & {
      skipSessionCheck?: boolean;
      isFormData?: boolean;
      customHeaders?: Record<string, string>;
    } = {}
  ): Promise<FatherShopsApiResponse<T>> {
    const cleanEndpoint = endpoint.replace(/^\//, "");
    const url = `${this.config.apiBaseUrl}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      "X-Tenant": this.config.tenant,
      "x-platform": this.config.platform,
    };

    if (this.config.domain) {
      headers["x-domain"] = this.config.domain;
    }

    const sessionId = this.getSessionId();
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    if (this.config.accessToken) {
      headers["Authorization"] = `Bearer ${this.config.accessToken}`;
    }

    if (!options.isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    headers["Accept"] = "application/json, text/html, */*";

    if (options.customHeaders) {
      Object.assign(headers, options.customHeaders);
    }

    if (options.headers) {
      Object.assign(headers, options.headers as Record<string, string>);
    }

    // Sanitize debug logs in development (omit tokens, passwords, payment info)
    if (process.env.NODE_ENV === "development") {
      const method = (options.method || "GET").toUpperCase();
      console.log(`[FatherShops API] ${method} ${cleanEndpoint}`);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr: any) {
      throw new FatherShopsApiError(
        `Network connection error: ${networkErr?.message || "Unable to reach FatherShops API"}`,
        0,
        networkErr,
        cleanEndpoint
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    // 1. Handle empty response body (e.g. fetchByToken)
    if (!rawText || rawText.trim() === "") {
      return {
        data: null as unknown as T,
        errors: [],
        code: response.status,
      };
    }

    // 2. Handle HTML response (e.g. store_not_found page returned with HTTP 200)
    if (contentType.includes("text/html") || rawText.trim().startsWith("<!DOCTYPE") || rawText.trim().startsWith("<html")) {
      if (rawText.includes("store_not_found") || rawText.includes("Store Not Found")) {
        throw new FatherShopsApiError(
          `Store '${this.config.tenant}' not found. Please verify X-Tenant configuration.`,
          404,
          { rawHtml: true },
          cleanEndpoint
        );
      }

      // If an endpoint legitimately returns HTML (e.g. /checkout/payment HTML markup)
      return {
        data: rawText as unknown as T,
        errors: [],
        code: response.status,
      };
    }

    // 3. Parse JSON safely
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      throw new FatherShopsApiError(
        `Malformed API response from ${cleanEndpoint}`,
        response.status,
        rawText.slice(0, 300),
        cleanEndpoint
      );
    }

    // 4. Inspect for application-level errors inside HTTP 200
    // FatherShops can return { errors: [...] }, { errors: { en: ... } }, { data: { error: "..." } }, etc.
    if (parsed.errors) {
      const hasArrayErrors = Array.isArray(parsed.errors) && parsed.errors.length > 0;
      const hasObjectErrors =
        !Array.isArray(parsed.errors) &&
        typeof parsed.errors === "object" &&
        Object.keys(parsed.errors).length > 0 &&
        // If it's an object with language keys, verify there are non-empty values
        Object.values(parsed.errors).some((val) => {
          if (Array.isArray(val)) return val.length > 0;
          if (typeof val === "object" && val !== null) return Object.keys(val).length > 0;
          return Boolean(val);
        });

      if (hasArrayErrors || hasObjectErrors) {
        const errorMsg = this.extractErrorMessage(parsed.errors);
        // Do not throw if it's an informational validation response that the caller needs to inspect (like coupon errors)
        // Attach errors to the return object so caller can handle gracefully
      }
    }

    if (parsed.error) {
      if (!parsed.errors) {
        parsed.errors = [parsed.error];
      }
    }

    if (parsed.data?.error) {
      if (!parsed.errors) {
        parsed.errors = [parsed.data.error];
      }
    }

    if (parsed.code === undefined) {
      parsed.code = response.status;
    }

    return parsed as FatherShopsApiResponse<T>;
  }

  /**
   * Helper to extract a user-readable error message from varied error structures.
   */
  public extractErrorMessage(errors: any): string {
    if (!errors) return "";
    if (typeof errors === "string") return errors;

    if (Array.isArray(errors)) {
      const first = errors[0];
      if (typeof first === "string") return first;
      if (typeof first === "object" && first !== null) {
        return first.en || first.message || Object.values(first)[0] || "API Error";
      }
      return "An unexpected error occurred.";
    }

    if (typeof errors === "object") {
      // Check en locale first
      if (errors.en) {
        if (typeof errors.en === "string") return errors.en;
        if (typeof errors.en === "object") {
          const vals = Object.values(errors.en);
          if (vals.length > 0) return typeof vals[0] === "string" ? vals[0] : JSON.stringify(vals[0]);
        }
      }
      const firstVal = Object.values(errors)[0];
      if (typeof firstVal === "string") return firstVal;
      if (typeof firstVal === "object" && firstVal !== null) {
        return this.extractErrorMessage(firstVal);
      }
    }

    return "An error occurred while processing your request.";
  }
}

export const fathershopsClient = new FatherShopsClient();
