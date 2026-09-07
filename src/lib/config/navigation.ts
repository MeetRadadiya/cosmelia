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
      href: "/categories/led-devices",
      badge: "Clinical",
      children: [
        {
          title: "Aura 7-Wave LED Mask",
          href: "/product/aura-led-phototherapy-mask",
          description: "Dual 630nm & 850nm medical phototherapy",
        },
        {
          title: "LED Wavelength Science",
          href: "/about#technology",
          description: "Clinical cellular studies & dermatological reports",
        },
      ],
      featuredItem: {
        title: "Aura 7-Wave LED Mask",
        subtitle: "The Gold Standard in Photobiomodulation",
        href: "/product/aura-led-phototherapy-mask",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      title: "Facial Tools",
      href: "/categories/facial-tools",
      children: [
        {
          title: "SculptPro Sonic Microcurrent",
          href: "/product/sculpt-pro-microcurrent-wand",
          description: "Targeted 400µA toning + 42°C dermal warmth",
        },
        {
          title: "Glacial Cryo Spheres",
          href: "/product/cryo-freeze-facial-globes",
          description: "Sub-zero borosilicate glass lymphatic drainage",
        },
      ],
      featuredItem: {
        title: "SculptPro Microcurrent",
        subtitle: "Instant Sculpting & Contouring",
        href: "/product/sculpt-pro-microcurrent-wand",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      title: "Bio-Skincare",
      href: "/categories/skincare",
      children: [
        {
          title: "Cellular Peptide Elixir",
          href: "/product/cellular-peptide-elixir-serum",
          description: "Multi-weight HA, snow mushroom & copper peptides",
        },
        {
          title: "Ceramide Lipid Crème",
          href: "/product/ceramide-lipid-barrier-restorative-creme",
          description: "Physiological 3:1:1 lipid barrier recovery",
        },
        {
          title: "Dissolving Microneedle Arrays",
          href: "/product/hyaluro-dissolving-microneedle-eye-patches",
          description: "Targeted transdermal hyaluronic delivery",
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
      { title: "LED Light Therapy", href: "/categories/led-devices" },
      { title: "Sculpting Tools", href: "/categories/facial-tools" },
      { title: "Bio-Skincare", href: "/categories/skincare" },
      { title: "Hydro Patches", href: "/categories/hydro-patches" },
    ],
    technology: [
      { title: "Clinical LED Science", href: "/about#technology" },
      { title: "Dermatologist Reviews", href: "/about#clinical" },
      { title: "Product Guides & Rituals", href: "/faq" },
      { title: "Sustainability Commitment", href: "/about#sustainability" },
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
      { title: "Accessibility Statement", href: "/terms#accessibility" },
      { title: "FatherShops Integration", href: "/about#integration" },
    ],
  },
};
