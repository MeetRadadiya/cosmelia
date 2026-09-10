import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoBannerSettings } from "../../lib/config/sections";
import { Product } from "../../lib/commerce/types";
import { Button } from "../ui/Button";

export const PromoBannerSection: React.FC<{
  settings?: PromoBannerSettings;
  products?: Product[];
}> = ({ settings, products = [] }) => {
  const eyebrow = settings?.eyebrow || "Featured Beauty Tech Selection";
  const title =
    settings?.title || "7-Color LED & Microcurrent EMS Rejuvenation";
  const description =
    settings?.description ||
    "Combine non-invasive photon light therapy with targeted microcurrent EMS muscle stimulation to tighten contours, smooth fine lines, and boost skin clarity from the comfort of home.";
  const ctaText = settings?.ctaText || "Shop Beauty Tech";
  const image =
    settings?.image ||
    "https://cdn.fathershops.com/f-images/catalog/1005006760144770/product_image_aesa_1005006760144770.jpg?origin=stock&origin=sites&width=800&height=600";
  const highlight =
    settings?.discountHighlight || "Official Cosmelia Beauty Tech Series";

  // Auto-resolve product detail page for EMS / LED beauty tech tool (ID 71 or 68)
  const targetProduct = products.find((p) => {
    const id = String(p.id);
    const name = p.name.toLowerCase();
    return id === "71" || id === "68" || name.includes("ems") || name.includes("microcurrent");
  }) || products[0];

  const productDetailUrl = targetProduct
    ? `/product/${targetProduct.slug || targetProduct.id}`
    : "/product/71";

  return (
    <section className="py-14 sm:py-20 bg-[#141416] text-[#FAF9F6] border-b border-white/10 overflow-hidden relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="luxury-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#C5A059] rounded-full border border-white/15 text-[11px] font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              {eyebrow}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F6] leading-[1.15]">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#8B92A2] font-light max-w-xl leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-4 py-2 text-xs text-[#FAF9F6]/90 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✓</span> 7 Light Spectrum Wavelengths
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✓</span> EMS Contour Tightening
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✓</span> Non-Invasive & Safe
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✓</span> Fast Tracked Delivery
              </div>
            </div>

            {highlight && (
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 text-xs font-mono text-[#C5A059] rounded-sm">
                ✦ {highlight}
              </div>
            )}

            <div className="pt-2">
              <Link href={productDetailUrl}>
                <Button variant="dark" size="lg">
                  {ctaText} &rarr;
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-square rounded-sm overflow-hidden border border-white/15 shadow-2xl group cursor-pointer">
            <Link href={productDetailUrl} className="block w-full h-full">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-serif italic text-white/90">
                  Cosmelia Signature Technology
                </span>
                <span className="bg-[#C5A059] text-[#141416] text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase">
                  View Product &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
