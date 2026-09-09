export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  currency: string;
  currencySymbol: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  social: {
    instagram: string;
    tiktok: string;
    pinterest: string;
    youtube: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "COSMELIA",
  tagline: "Modern Beauty Tools & Everyday Self-Care Essentials",
  description:
    "Thoughtfully selected beauty tools and self-care accessories designed to make your daily routine simple, accessible, and enjoyable.",
  url: process.env.NEXT_PUBLIC_STORE_URL || "https://getcosmelia.com",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$",
  supportEmail: "concierge@getcosmelia.com",
  supportPhone: "+1 (800) 492-7108",
  address: "United States",
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com",
  },
  announcement: {
    enabled: true,
    text: "Thoughtfully Curated Beauty Tools • Tracked US Shipping",
    link: "/products",
  },
};
