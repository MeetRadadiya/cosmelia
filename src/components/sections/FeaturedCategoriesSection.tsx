import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "../../lib/commerce/types";

interface FeaturedCategoriesSectionProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export const FeaturedCategoriesSection: React.FC<FeaturedCategoriesSectionProps> = ({
  categories,
  title = "Targeted Clinical Modalities",
  subtitle = "Select your dedicated protocol from professional light therapy to transdermal micro-infusion.",
}) => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Portfolio Overview
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">{title}</h2>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col bg-white border border-[#EAE8E1] rounded-sm overflow-hidden hover:border-[#C5A059] transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F4EF]">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h3 className="text-base font-serif font-medium tracking-wide">{cat.name}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-2 mt-1 font-light">{cat.description}</p>
                  <span className="inline-block mt-3 text-[10px] uppercase font-bold tracking-widest text-[#E8D5C4] group-hover:translate-x-1 transition-transform">
                    Explore Line &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
