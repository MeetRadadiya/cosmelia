import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Product } from "../../lib/commerce/types";

export const FinalCTASection: React.FC<{ products?: Product[] }> = ({
  products = [],
}) => {
  const featuredProduct = products[0];
  const primaryUrl = featuredProduct
    ? `/product/${featuredProduct.slug || featuredProduct.id}`
    : "/products";

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] text-[#141416] text-center relative overflow-hidden border-t border-[#EAE8E1]">
      <div className="luxury-container max-w-3xl space-y-6 relative z-10">
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#C5A059]">
          Elevate Your Daily Ritual
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#141416] leading-tight">
          Simple Tools for Relaxing Self-Care Moments
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-lg mx-auto leading-relaxed">
          Discover our thoughtfully selected collection of beauty tools and
          self-care accessories, designed to complement your personal daily
          skincare and relaxation rituals at home.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href={primaryUrl}>
            <Button variant="primary" size="lg">
              Shop Featured Product &rarr;
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">
              Explore Catalog &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
