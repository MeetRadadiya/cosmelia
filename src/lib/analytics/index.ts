/**
 * Provider-agnostic Analytics Abstraction
 * Prevents hard-coding any specific tracking script or vendor into UI components.
 */

export type AnalyticsEvent =
  | "page_view"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_wishlist"
  | "begin_checkout"
  | "purchase"
  | "search"
  | "newsletter_signup";

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  payload?: Record<string, unknown>;
}

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  // Always respect client-side environment
  if (typeof window === "undefined") return;

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics Event: ${event}]`, payload);
  }

  // Google Analytics 4 integration (if configured)
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (gaId && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", event, payload);
  }

  // Meta Pixel integration (if configured)
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (pixelId && typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === "function") {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("trackCustom", event, payload);
  }
}
