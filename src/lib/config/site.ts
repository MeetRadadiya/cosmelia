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
    "Discover thoughtfully selected beauty tools and self-care accessories at Cosmelia. Shop LED beauty masks, facial sculpting massagers, cooling ice rollers, and pimple patches.",
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
    text: "Modern Beauty Tools & Everyday Self-Care Essentials",
  },
};
