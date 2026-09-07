import React from "react";
import Link from "next/link";
import { Product } from "../../lib/commerce/types";
import { ProductCard } from "../common/ProductCard";

interface ProductGridSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  products,
  title = "Curated Formulations & Instruments",
  subtitle = "Clinically validated treatments engineered for radiant cellular transformation.",
  viewAllLink = "/products",
}) => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Clinical Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light">
              {subtitle}
            </p>
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs uppercase tracking-widest font-semibold text-[#141416] hover:text-[#8C734B] transition-colors inline-flex items-center gap-1 group pb-1 border-b border-[#141416] hover:border-[#8C734B] self-start md:self-end"
            >
              <span>View All Formulations</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
