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
      badge: "New Arrival • Light Therapy & Beauty Tech",
      headline: "Transformative Care with",
      highlightedWord: "7-Color LED Masks",
      description:
        "Experience professional-grade photon light therapy at home. Targets wrinkles, promotes collagen production, and restores skin radiance.",
      primaryCtaText: "Shop LED Masks",
      primaryCtaLink: "/products",
      secondaryCtaText: "Explore Collections",
      secondaryCtaLink: "/categories",
      heroImage:
        "https://cdn.fathershops.com/f-images/catalog/1005005484832355/product_image_aesa_1005005484832355.jpg?origin=stock&origin=sites&width=800&height=1000&aspect_ratio=4:5",
      heroImageAlt: "7-Color Light LED Facial Rejuvenation Mask",
      stats: [
        { value: "7 Colors", label: "Targeted Light Waves" },
        { value: "At-Home", label: "Spa-Grade Treatment" },
        { value: "Express", label: "Tracked Shipping" },
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
      subtitle:
        "Explore our selected tools—from LED photon therapy masks and ice globes to hydrocolloid blemish patches.",
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
      eyebrow: "Featured Beauty Tech Selection",
      badge: "Curated Favorite",
      title: "7-Color LED & Microcurrent EMS Rejuvenation",
      description:
        "Combine non-invasive photon light therapy with targeted microcurrent EMS muscle stimulation to tighten contours, smooth fine lines, and boost skin clarity.",
      discountHighlight: "Official Cosmelia Beauty Tech Series",
      ctaText: "Explore Beauty Tech",
      ctaLink: "/products",
      image:
        "https://cdn.fathershops.com/f-images/catalog/1005006760144770/product_image_aesa_1005006760144770.jpg?origin=stock&origin=sites&width=800&height=600",
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
      tagline: "The Cosmelia Philosophy",
      title: "Thoughtful Beauty Tools for Everyday Rituals",
      paragraph1:
        "Cosmelia is an online sanctuary dedicated to high-performance beauty tools and self-care accessories. We believe your daily skincare routine should be simple, effective, and deeply relaxing.",
      paragraph2:
        "From LED photon rejuvenation masks and dual ice globes to hydrocolloid blemish patches and collagen eye masks, every item in our store is carefully chosen to elevate your personal beauty lifestyle.",
      quote:
        "True self-care is not about complex steps; it is about taking a mindful moment for yourself each day.",
      author: "Cosmelia Curators",
      image:
        "https://cdn.fathershops.com/f-images/catalog/1005011893052635/product_image_aesa_1005011893052635.jpg?origin=stock&origin=sites&width=800&height=800",
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
