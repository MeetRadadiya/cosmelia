import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandStorySettings } from "../../lib/config/sections";
import { Product } from "../../lib/commerce/types";
import { Button } from "../ui/Button";

export const BrandStorySection: React.FC<{
  settings?: BrandStorySettings;
  products?: Product[];
}> = ({ settings, products = [] }) => {
  const tagline = settings?.tagline || "The Cosmelia Philosophy";
  const title =
    settings?.title || "Thoughtful Beauty Tools for Everyday Rituals";
  const paragraph1 =
    settings?.paragraph1 ||
    "Cosmelia is an online sanctuary dedicated to high-performance beauty tools and self-care accessories. We believe your daily skincare routine should be simple, effective, and deeply relaxing.";
  const paragraph2 =
    settings?.paragraph2 ||
    "From LED photon rejuvenation masks and dual ice globes to hydrocolloid blemish patches and collagen eye masks, every item in our store is carefully chosen to elevate your personal beauty lifestyle.";
  const quote =
    settings?.quote ||
    "True self-care is not about complex steps; it is about taking a mindful moment for yourself each day.";
  const author = settings?.author || "Cosmelia Curators";
  const image =
    settings?.image ||
    "https://cdn.fathershops.com/f-images/catalog/1005011893052635/product_image_aesa_1005011893052635.jpg?origin=stock&origin=sites&width=800&height=800";

  // Target product for 3-Piece Cleansing & Gua Sha Set (ID 61)
  const targetProduct = products.find((p) => {
    const id = String(p.id);
    const name = p.name.toLowerCase();
    return id === "61" || name.includes("gua sha") || name.includes("cleansing");
  }) || products[0];

  const productDetailUrl = targetProduct
    ? `/product/${targetProduct.slug || targetProduct.id}`
    : "/product/61";

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square rounded-sm overflow-hidden border border-[#EAE8E1] shadow-xl group cursor-pointer">
            <Link href={productDetailUrl} className="block w-full h-full">
              <Image
                src={image}
                alt="Cosmelia Curated Beauty Rituals"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-[#141416] text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-sm group-hover:bg-[#8C734B] group-hover:text-white transition-colors">
                View 3-Piece Gua Sha Set &rarr;
              </div>
            </Link>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              {tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#141416] leading-snug">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
              {paragraph1}
            </p>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
              {paragraph2}
            </p>

            <div>
              <Link href={productDetailUrl}>
                <Button variant="primary" size="md">
                  Shop Cleansing & Gua Sha Set &rarr;
                </Button>
              </Link>
            </div>

            <blockquote className="pt-4 border-t border-[#EAE8E1] space-y-2">
              <p className="font-serif italic text-sm md:text-base text-[#141416]">
                &ldquo;{quote}&rdquo;
              </p>
              <footer className="text-[11px] uppercase tracking-wider text-[#8C734B] font-semibold">
                — {author}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
