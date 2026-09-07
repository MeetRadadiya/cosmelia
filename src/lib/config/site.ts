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
  tagline: "Cellular Longevity & Clinical Phototherapy",
  description:
    "Elevate your daily dermal ritual with clinical 7-wavelength LED phototherapy, microcurrent sculptors, and bio-fermented peptide elixirs.",
  url: process.env.NEXT_PUBLIC_STORE_URL || "https://getcosmelia.com",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$",
  supportEmail: "concierge@getcosmelia.com",
  supportPhone: "+1 (800) 492-7108",
  address: "450 North Rodeo Drive, Beverly Hills, CA 90210",
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com",
  },
  announcement: {
    enabled: true,
    text: "Complimentary Worldwide Express Delivery on orders over $100 • 60-Day Clinical Guarantee",
    link: "/products",
  },
};
