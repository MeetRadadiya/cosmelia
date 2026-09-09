import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-24 bg-[#141416] text-[#FAF9F6] text-center relative overflow-hidden">
      <div className="luxury-container max-w-3xl space-y-6 relative z-10">
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#C5A059]">
          Elevate Your Daily Ritual
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F6] leading-tight">
          Simple Tools for Relaxing Self-Care Moments
        </h2>
        <p className="text-xs sm:text-sm text-[#8B92A2] font-light max-w-lg mx-auto leading-relaxed">
          Discover our thoughtfully selected collection of beauty tools and self-care accessories, designed to complement your personal daily skincare and relaxation rituals at home.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <Button variant="dark" size="lg">
              Shop Best Sellers
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-black">
              Explore All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
