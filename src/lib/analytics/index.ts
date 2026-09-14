/**
 * Provider-agnostic Analytics Abstraction
 * Prevents hard-coding any specific tracking script or vendor into UI components.
 * 
 * Supports:
 * - Google Analytics 4 (GA4)
 * - Google Tag Manager (GTM)
 * - Meta (Facebook) Pixel
 * - TikTok Pixel
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

  const win = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    ttq?: { page: () => void; track: (evt: string, data?: Record<string, unknown>) => void };
  };

  const currency = (payload?.currency as string) || "USD";
  const value = typeof payload?.value === "number" ? payload.value : (payload?.price as number) || 0;

  // 1. Google Analytics 4 (GA4) Integration
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (gaId && typeof win.gtag === "function") {
    switch (event) {
      case "page_view":
        win.gtag("event", "page_view", {
          page_path: window.location.pathname,
          ...payload,
        });
        break;
      case "view_item":
        win.gtag("event", "view_item", {
          currency,
          value,
          items: payload?.items || [
            {
              item_id: payload?.item_id || payload?.id,
              item_name: payload?.item_name || payload?.name,
              price: value,
            },
          ],
        });
        break;
      case "add_to_cart":
        win.gtag("event", "add_to_cart", {
          currency,
          value,
          items: payload?.items || [
            {
              item_id: payload?.item_id || payload?.id,
              item_name: payload?.item_name || payload?.name,
              price: value,
              quantity: payload?.quantity || 1,
            },
          ],
        });
        break;
      case "add_to_wishlist":
        win.gtag("event", "add_to_wishlist", {
          currency,
          value,
          items: payload?.items || [
            {
              item_id: payload?.item_id || payload?.id,
              item_name: payload?.item_name || payload?.name,
            },
          ],
        });
        break;
      case "begin_checkout":
        win.gtag("event", "begin_checkout", {
          currency,
          value,
          items: payload?.items,
        });
        break;
      case "purchase":
        win.gtag("event", "purchase", {
          transaction_id: payload?.transaction_id || payload?.order_id,
          currency,
          value,
          items: payload?.items,
        });
        break;
      case "search":
        win.gtag("event", "search", {
          search_term: payload?.search_term || payload?.query,
        });
        break;
      default:
        win.gtag("event", event, payload);
        break;
    }
  }

  // 2. Google Tag Manager (GTM) Integration
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PRLSPDND";
  if (gtmId && Array.isArray(win.dataLayer)) {
    win.dataLayer.push({
      event,
      ...payload,
    });
  }

  // 3. Meta (Facebook) Pixel Integration
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1380047323675399";
  if (pixelId && typeof win.fbq === "function") {
    switch (event) {
      case "page_view":
        win.fbq("track", "PageView");
        break;
      case "view_item":
        win.fbq("track", "ViewContent", {
          content_name: payload?.item_name || payload?.name,
          content_ids: payload?.item_id ? [String(payload.item_id)] : [],
          content_type: "product",
          value,
          currency,
        });
        break;
      case "add_to_cart":
        win.fbq("track", "AddToCart", {
          content_name: payload?.name || payload?.item_name,
          value,
          currency,
        });
        break;
      case "add_to_wishlist":
        win.fbq("track", "AddToWishlist", {
          content_name: payload?.name || payload?.item_name,
          value,
          currency,
        });
        break;
      case "begin_checkout":
        win.fbq("track", "InitiateCheckout", {
          value,
          currency,
        });
        break;
      case "purchase":
        win.fbq("track", "Purchase", {
          value,
          currency,
        });
        break;
      case "search":
        win.fbq("track", "Search", {
          search_string: payload?.search_term || payload?.query,
        });
        break;
      default:
        win.fbq("trackCustom", event, payload);
        break;
    }
  }

  // 4. TikTok Pixel Integration
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (tiktokPixelId && win.ttq) {
    switch (event) {
      case "page_view":
        win.ttq.page();
        break;
      case "view_item":
        win.ttq.track("ViewContent", {
          content_id: payload?.item_id || payload?.id,
          content_name: payload?.item_name || payload?.name,
          value,
          currency,
        });
        break;
      case "add_to_cart":
        win.ttq.track("AddToCart", {
          content_id: payload?.item_id || payload?.id,
          content_name: payload?.name,
          value,
          currency,
        });
        break;
      case "begin_checkout":
        win.ttq.track("InitiateCheckout", {
          value,
          currency,
        });
        break;
      case "purchase":
        win.ttq.track("PlaceAnOrder", {
          value,
          currency,
        });
        break;
      case "search":
        win.ttq.track("Search", {
          query: payload?.search_term || payload?.query,
        });
        break;
      default:
        win.ttq.track(event, payload);
        break;
    }
  }
}
