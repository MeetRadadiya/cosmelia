export type SectionType =
  | "hero"
  | "trust_benefits"
  | "featured_categories"
  | "featured_products"
  | "promo_banner"
  | "how_it_works"
  | "brand_story"
  | "testimonials"
  | "faq"
  | "newsletter"
  | "final_cta";

export interface SectionConfig<T = unknown> {
  id: string;
  type: SectionType;
  enabled: boolean;
  settings: T;
}

export interface HeroSettings {
  badge: string;
  headline: string;
  highlightedWord: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: string;
  heroImageAlt: string;
  stats: Array<{ label: string; value: string }>;
}

export interface FeaturedProductsSettings {
  title: string;
  subtitle: string;
  collection: "best_sellers" | "featured" | "new_arrivals";
  limit: number;
  viewAllLink: string;
}

export interface PromoBannerSettings {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  eyebrow?: string;
  discountHighlight?: string;
}

export interface BrandStorySettings {
  tagline: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  author: string;
  image: string;
}

export const defaultHomepageSections: SectionConfig[] = [
  {
    id: "hero-1",
    type: "hero",
    enabled: true,
    settings: {
      badge: "Beauty • Self-Care • Everyday Wellness",
      headline: "Simple Tools for",
      highlightedWord: "Better Self-Care",
      description:
        "Thoughtfully selected beauty tools and self-care accessories designed to make your everyday routines easier, relaxing, and enjoyable from the comfort of home.",
      primaryCtaText: "Shop Best Sellers",
      primaryCtaLink: "/products",
      secondaryCtaText: "Explore Collection",
      secondaryCtaLink: "/categories",
      heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
      heroImageAlt: "Cosmelia beauty and self-care routine",
      stats: [
        { value: "Curated", label: "Carefully Selected Products" },
        { value: "Everyday", label: "Simple At-Home Routines" },
        { value: "Tracked", label: "Reliable US Shipping" },
      ],
    } as HeroSettings,
  },
  {
    id: "benefits-1",
    type: "trust_benefits",
    enabled: true,
    settings: {},
  },
  {
    id: "categories-1",
    type: "featured_categories",
    enabled: true,
    settings: {
      title: "Curated Beauty Categories",
      subtitle: "Explore our selected tools from gentle facial rollers to comforting self-care accessories.",
    },
  },
  {
    id: "featured-bestsellers",
    type: "featured_products",
    enabled: true,
    settings: {
      title: "Featured & Best-Selling Tools",
      subtitle: "Discover customer favorites designed to complement your daily beauty rituals.",
      collection: "best_sellers",
      limit: 4,
      viewAllLink: "/products",
    } as FeaturedProductsSettings,
  },
  {
    id: "promo-1",
    type: "promo_banner",
    enabled: true,
    settings: {
      eyebrow: "Featured Self-Care Selection",
      badge: "Curated Favorite",
      title: "The Everyday Refresh Ritual",
      description:
        "Pair cooling facial rollers with gentle skincare accessories for a soothing, mindful morning or evening self-care routine.",
      discountHighlight: "Thoughtfully Selected by Cosmelia",
      ctaText: "Discover Products",
      ctaLink: "/products",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
    } as PromoBannerSettings,
  },
  {
    id: "how-it-works-1",
    type: "how_it_works",
    enabled: true,
    settings: {},
  },
  {
    id: "brand-story-1",
    type: "brand_story",
    enabled: true,
    settings: {
      tagline: "The Cosmelia Approach",
      title: "Thoughtful Tools for Everyday Rituals",
      paragraph1:
        "Cosmelia is an online destination for thoughtfully selected beauty tools and self-care accessories. We believe daily self-care should be simple, enjoyable, and accessible to everyone at home.",
      paragraph2:
        "We search and curate versatile items—from cooling facial globes and blemish patches to soothing face massagers—that fit naturally into your personal beauty lifestyle.",
      quote: "Self-care is not about complexity; it is about taking a mindful moment for yourself each day.",
      author: "Cosmelia Curators",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80",
    } as BrandStorySettings,
  },
  {
    id: "testimonials-1",
    type: "testimonials",
    enabled: true,
    settings: {},
  },
  {
    id: "faq-1",
    type: "faq",
    enabled: true,
    settings: {},
  },
  {
    id: "newsletter-1",
    type: "newsletter",
    enabled: true,
    settings: {},
  },
  {
    id: "final-cta-1",
    type: "final_cta",
    enabled: true,
    settings: {},
  },
];
