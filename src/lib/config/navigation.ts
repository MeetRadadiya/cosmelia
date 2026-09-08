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
      title: "LED Face Masks",
      href: "/categories/led-face-mask-30",
      badge: "Bestseller",
    },
    {
      title: "Facial Tools",
      href: "/categories/neck-face-lifting-massager-31",
      children: [
        {
          title: "Neck & Face Lift Massagers",
          href: "/categories/neck-face-lifting-massager-31",
          description: "Microcurrent & acoustic contouring sculptors",
        },
        {
          title: "Ice Rollers & Cryo Tools",
          href: "/categories/ice-roller-24",
          description: "Cryo lymphatic drainage globes & rollers",
        },
      ],
      featuredItem: {
        title: "Sonic Lifting Massager",
        subtitle: "Contour & Sculpting Therapy",
        href: "/categories/neck-face-lifting-massager-31",
        image: "https://cdn.fathershops.com/f-images/catalog/1005007170717983/product_image_aesa_1005007170717983.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
      },
    },
    {
      title: "Patches & Care",
      href: "/categories/pimple-patches-21",
      children: [
        {
          title: "Acne & Pimple Patches",
          href: "/categories/pimple-patches-21",
          description: "Hydrocolloid invisible blemish & spot stickers",
        },
        {
          title: "Collagen Eye Patches",
          href: "/categories/eye-patche-22",
          description: "Under-eye care stickers & soothing gel pads",
        },
      ],
      featuredItem: {
        title: "Hydrocolloid Blemish Stickers",
        subtitle: "Targeted Overnight Spot Healing",
        href: "/categories/pimple-patches-21",
        image: "https://cdn.fathershops.com/f-images/catalog/1005012202383892/product_image_aesa_1005012202383892.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
      },
    },
    {
      title: "About Us",
      href: "/about",
    },
    {
      title: "FAQ",
      href: "/faq",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  footerNav: {
    shop: [
      { title: "All Collections", href: "/products" },
      { title: "LED Face Masks", href: "/categories/led-face-mask-30" },
      { title: "Neck & Face Massagers", href: "/categories/neck-face-lifting-massager-31" },
      { title: "Ice Rollers & Cryo", href: "/categories/ice-roller-24" },
      { title: "Acne & Pimple Patches", href: "/categories/pimple-patches-21" },
      { title: "Collagen Eye Patches", href: "/categories/eye-patche-22" },
    ],
    support: [
      { title: "Contact Concierge", href: "/contact" },
      { title: "FAQ & Help Center", href: "/faq" },
      { title: "Shipping & Delivery", href: "/shipping" },
      { title: "Returns & Exchanges", href: "/returns" },
    ],
    legal: [
      { title: "About COSMELIA", href: "/about" },
      { title: "Customer Account", href: "/account" },
      { title: "Order Tracking", href: "/account/orders" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
    ],
  },
};