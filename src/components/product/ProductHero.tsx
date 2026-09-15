"use client";

import React, { useState } from "react";
import { Product } from "@/lib/commerce/types";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchaseSection } from "./ProductPurchaseSection";
import { ProductRatingBadge } from "./ProductRatingBadge";

interface ProductHeroProps {
  product: Product;
  reviewsEnabled?: boolean;
  serverSummary?: {
    averageRating: number | string;
    totalReviews: number;
  };
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  product,
  reviewsEnabled,
  serverSummary,
}) => {
  // Synchronized active gallery image driven by gallery thumbnail clicks or option selections
  const [activeImage, setActiveImage] = useState<string | undefined>(product.thumbnail || product.images?.[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-8">
      {/* Gallery Section */}
      <div className="lg:col-span-6">
        <ProductGallery
          images={product.images}
          name={product.name}
          activeImage={activeImage}
          onSelectImage={setActiveImage}
        />
      </div>

      {/* Product Purchasing & Details Section */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2 border-b border-[#EAE8E1] pb-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              {product.category}
            </span>
            {reviewsEnabled && serverSummary && (
              <ProductRatingBadge
                product={product}
                initialRating={Number(serverSummary.averageRating)}
                initialReviewCount={serverSummary.totalReviews}
                size="md"
              />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#141416] leading-tight">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="text-xs text-[#8C734B] font-medium tracking-wide">
              ✦ {product.tagline}
            </p>
          )}
        </div>

        {/* Interactive Buy Box with Color & Option Sync */}
        <ProductPurchaseSection
          product={product}
          onOptionImageChange={(imgUrl) => setActiveImage(imgUrl)}
        />
      </div>
    </div>
  );
};
