"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSettings } from "../../lib/config/sections";
import { Product } from "../../lib/commerce/types";
import { Button } from "../ui/Button";

export const HeroSection: React.FC<{
  settings?: HeroSettings;
  products?: Product[];
}> = ({ settings, products = [] }) => {
  // 1. Dynamic Top Selling Product Resolution:
  // Check for product with salesCount > 0 or marked as best-seller.
  // Fallback to LED Face Mask (Product ID 68 / 69 / 67 / 66) when no sales recorded yet.
  const topSellingProduct =
    products.find((p) => (p as any).salesCount > 0 || (p as any).isBestSeller) ||
    products.find((p) => {
      const id = String(p.id);
      const name = p.name.toLowerCase();
      return (
        id === "68" ||
        id === "69" ||
        id === "67" ||
        id === "66" ||
        (name.includes("led") && name.includes("mask"))
      );
    }) ||
    products[0];

  const productDetailUrl = topSellingProduct
    ? `/product/${topSellingProduct.slug || topSellingProduct.id}`
    : "/product/68";

  const heroImage =
    topSellingProduct?.images?.[0] ||
    topSellingProduct?.thumbnail ||
    settings?.heroImage ||
    "https://cdn.fathershops.com/f-images/catalog/1005005484832355/product_image_aesa_1005005484832355.jpg?origin=stock&origin=sites&width=800&height=1000&aspect_ratio=4:5";

  const productName = topSellingProduct?.name || "7-Color Light LED Facial Rejuvenation Mask";

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[500px]">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-5 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EEE5] text-[#825E36] rounded-full border border-[#E8D5C4] text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#825E36] animate-pulse" />
              ✦ #1 Top Selling Beauty Essential
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-[#141416] leading-[1.15]">
              7-Color Light LED <br />
              <span className="italic font-light text-[#8C734B]">Facial Rejuvenation Mask</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#5E6472] font-light max-w-lg leading-relaxed">
              Our #1 top-rated light therapy mask. Harness 7 LED light spectrums to target wrinkles, boost collagen production, reduce blemishes, and achieve a flawless complexion from home.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {/* Primary CTA button linking directly to top seller product detail page */}
              <Link href={productDetailUrl}>
                <Button variant="primary" size="lg">
                  Shop Top Seller &rarr;
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" size="lg">
                  Explore Catalog
                </Button>
              </Link>
            </div>

            {/* Customer Trust Metrics */}
            <div className="pt-6 border-t border-[#EAE8E1] grid grid-cols-3 gap-4">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg md:text-xl font-serif font-semibold text-[#141416]">
                  7 Colors
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-[#5E6472] uppercase tracking-wider font-medium line-clamp-1">
                  Photon Light Therapy
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg md:text-xl font-serif font-semibold text-[#141416]">
                  At-Home
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-[#5E6472] uppercase tracking-wider font-medium line-clamp-1">
                  Spa-Grade Rejuvenation
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg md:text-xl font-serif font-semibold text-[#141416]">
                  Express
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-[#5E6472] uppercase tracking-wider font-medium line-clamp-1">
                  Tracked Shipping
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Area - Single Top Seller Product Image */}
          <div className="lg:col-span-6 relative">
            <Link href={productDetailUrl} className="block group">
              <div className="relative aspect-square rounded-sm overflow-hidden shadow-2xl border border-[#EAE8E1]">
                <Image
                  src={heroImage}
                  alt={productName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#141416] text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-sm group-hover:bg-[#8C734B] group-hover:text-white transition-colors">
                  View Product Detail &rarr;
                </div>
              </div>
            </Link>

            {/* Floating Product Badge */}
            <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-sm shadow-xl border border-[#EAE8E1] hidden sm:flex items-center gap-3 max-w-xs z-10 pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-[#F4EEE5] flex items-center justify-center text-[#825E36] flex-shrink-0 font-serif text-base">
                ✦
              </div>
              <div>
                <p className="text-xs font-semibold text-[#141416]">✦ Top Selling Beauty Essential</p>
                <p className="text-[10px] text-[#5E6472]">7-Color LED Facial Rejuvenation Mask</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
