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
      badge: "Clinical Aesthetics • Cellular Vitality",
      headline: "The Science of Dermal",
      highlightedWord: "Luminescence",
      description:
        "Engineered for deep cellular rejuvenation. Merge clinical-grade 7-wave phototherapy with bio-identical peptide nutrition for luminous, age-defying skin.",
      primaryCtaText: "Discover Aura LED",
      primaryCtaLink: "/product/aura-led-phototherapy-mask",
      secondaryCtaText: "Explore Collection",
      secondaryCtaLink: "/products",
      heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
      heroImageAlt: "Aura LED Phototherapy Mask on model",
      stats: [
        { value: "98.4%", label: "Clinically observed collagen density" },
        { value: "10 Min", label: "Fast hands-free daily treatment" },
        { value: "Class II", label: "Medical-grade FDA Cleared design" },
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
      title: "Targeted Clinical Modalities",
      subtitle: "Select your dedicated protocol from professional light therapy to transdermal micro-infusion.",
    },
  },
  {
    id: "featured-bestsellers",
    type: "featured_products",
    enabled: true,
    settings: {
      title: "Iconic Formulations & Devices",
      subtitle: "Our most coveted, dermatologist-recommended beauty breakthroughs.",
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
      eyebrow: "Limited Edition Device Protocol",
      badge: "Exclusive Synergy Set",
      title: "The Sculpt & Glow Clinical Suite",
      description:
        "Pair the Aura 7-Wave Phototherapy Mask with the SculptPro Microcurrent Wand and receive a complimentary 50ml Cellular Peptide Elixir.",
      discountHighlight: "Save $145 with code SYNERGY",
      ctaText: "Claim Your Suite",
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
      tagline: "The COSMELIA Philosophy",
      title: "Where Cellular Biology Meets Pure Luxury",
      paragraph1:
        "Founded at the crossroads of photomedicine and molecular biochemistry, COSMELIA redefines daily self-care. We replace invasive clinic visits with effortless, scientifically proven dermal instruments designed for modern rituals.",
      paragraph2:
        "Every diode, curved medical silicone seam, and botanical ferment is meticulously crafted to respect the epidermal barrier while triggering cellular ATP renewal at the mitochondrial level.",
      quote: "True skin luminescence is not covered up; it is activated at the cellular stratum.",
      author: "Dr. Genevieve Vance, MD • Chief Bio-Aesthetic Architect",
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
