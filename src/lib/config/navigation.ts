export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  children?: {
    title: string;
    href: string;
    description?: string;
  }[];
  featuredItem?: {
    title: string;
    subtitle: string;
    href: string;
    image: string;
  };
}

export const navigationConfig: {
  mainNav: NavItem[];
  footerNav: {
    shop: { title: string; href: string }[];
    technology: { title: string; href: string }[];
    support: { title: string; href: string }[];
    legal: { title: string; href: string }[];
  };
} = {
  mainNav: [
    {
      title: "All Products",
      href: "/products",
    },
    {
      title: "LED Devices",
      href: "/categories/led-face-mask-30",
      badge: "Clinical",
      children: [
        {
          title: "LED Face Masks",
          href: "/categories/led-face-mask-30",
          description: "Multi-wavelength clinical phototherapy masks",
        },
        {
          title: "LED Wavelength Science",
          href: "/about#technology",
          description: "Clinical cellular studies & dermatological reports",
        },
      ],
      featuredItem: {
        title: "LED Face Masks",
        subtitle: "Clinical Photobiomodulation",
        href: "/categories/led-face-mask-30",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      title: "Facial Tools",
      href: "/categories/neck-face-lifting-massager-31",
      children: [
        {
          title: "Neck & Face Lifting Massagers",
          href: "/categories/neck-face-lifting-massager-31",
          description: "Microcurrent & massage sculpting instruments",
        },
        {
          title: "Ice Rollers & Cryo Tools",
          href: "/categories/ice-roller-24",
          description: "Cryo lymphatic drainage rollers",
        },
      ],
      featuredItem: {
        title: "Neck & Face Lifting Massager",
        subtitle: "Instant Sculpting & Contouring",
        href: "/categories/neck-face-lifting-massager-31",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      title: "Bio-Skincare",
      href: "/categories/health-beauty-26",
      children: [
        {
          title: "Pimple Patches",
          href: "/categories/pimple-patches-21",
          description: "Hydrocolloid blemish & spot patches",
        },
        {
          title: "Eye Patches",
          href: "/categories/eye-patche-22",
          description: "Under-eye care stickers & gel pads",
        },
        {
          title: "Health & Beauty",
          href: "/categories/health-beauty-26",
          description: "Clinical wellness accessories",
        },
      ],
    },
    {
      title: "About Us",
      href: "/about",
    },
  ],
  footerNav: {
    shop: [
      { title: "All Collections", href: "/products" },
      { title: "LED Face Masks", href: "/categories/led-face-mask-30" },
      { title: "Lifting & Massage Tools", href: "/categories/neck-face-lifting-massager-31" },
      { title: "Bio-Skincare", href: "/categories/health-beauty-26" },
      { title: "Pimple & Eye Patches", href: "/categories/pimple-patches-21" },
    ],
    technology: [
      { title: "Clinical LED Science", href: "/about#technology" },
      { title: "Dermatologist Reviews", href: "/about" },
      { title: "Product Guides & Rituals", href: "/faq" },
      { title: "Sustainability & Clinical Guarantee", href: "/returns" },
    ],
    support: [
      { title: "Concierge Contact", href: "/contact" },
      { title: "Order Tracking", href: "/account/orders" },
      { title: "FAQ & Help Center", href: "/faq" },
      { title: "Shipping & Handling", href: "/shipping" },
      { title: "Returns & Exchanges", href: "/returns" },
    ],
    legal: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "FatherShops Integration", href: "/about" },
    ],
  },
};