import React from "react";
import { SectionConfig, HeroSettings, PromoBannerSettings, BrandStorySettings, FeaturedProductsSettings } from "../../lib/config/sections";
import { Product, Category } from "../../lib/commerce/types";
import { HeroSection } from "./HeroSection";
import { TrustBenefitsSection } from "./TrustBenefitsSection";
import { FeaturedCategoriesSection } from "./FeaturedCategoriesSection";
import { ProductGridSection } from "./ProductGridSection";
import { PromoBannerSection } from "./PromoBannerSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { BrandStorySection } from "./BrandStorySection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { NewsletterSection } from "./NewsletterSection";
import { FinalCTASection } from "./FinalCTASection";

interface SectionRendererProps {
  sections: SectionConfig[];
  products: Product[];
  categories: Category[];
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  sections,
  products,
  categories,
}) => {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case "hero":
            return (
              <HeroSection
                key={section.id}
                settings={section.settings as unknown as HeroSettings}
              />
            );
          case "trust_benefits":
            return <TrustBenefitsSection key={section.id} />;
          case "featured_categories":
            return (
              <FeaturedCategoriesSection
                key={section.id}
                categories={categories}
              />
            );
          case "featured_products": {
            const settings = section.settings as unknown as FeaturedProductsSettings;
            const limit = settings?.limit || 4;
            const displayProducts = products.slice(0, limit);
            return (
              <ProductGridSection
                key={section.id}
                products={displayProducts}
                title={settings?.title}
                subtitle={settings?.subtitle}
                viewAllLink={settings?.viewAllLink}
              />
            );
          }
          case "promo_banner":
            return (
              <PromoBannerSection
                key={section.id}
                settings={section.settings as unknown as PromoBannerSettings}
              />
            );
          case "how_it_works":
            return <HowItWorksSection key={section.id} />;
          case "brand_story":
            return (
              <BrandStorySection
                key={section.id}
                settings={section.settings as unknown as BrandStorySettings}
              />
            );
          case "testimonials":
            return <TestimonialsSection key={section.id} />;
          case "faq":
            return <FAQSection key={section.id} />;
          case "newsletter":
            return <NewsletterSection key={section.id} />;
          case "final_cta":
            return <FinalCTASection key={section.id} />;
          default:
            return null;
        }
      })}
    </>
  );
};
