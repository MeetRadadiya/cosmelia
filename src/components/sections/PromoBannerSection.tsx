import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoBannerSettings } from "../../lib/config/sections";
import { Button } from "../ui/Button";

export const PromoBannerSection: React.FC<{ settings: PromoBannerSettings }> = ({ settings }) => {
  return (
    <section className="py-16 bg-[#141416] text-[#FAF9F6] border-b border-white/10 overflow-hidden relative">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {settings.eyebrow && (
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
                {settings.eyebrow}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F6] leading-tight">
              {settings.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#8B92A2] font-light max-w-lg leading-relaxed">
              {settings.description}
            </p>

            {settings.discountHighlight && (
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 text-xs font-mono text-[#C5A059] rounded-sm">
                ✦ {settings.discountHighlight}
              </div>
            )}

            <div>
              <Link href={settings.ctaLink}>
                <Button variant="dark" size="lg">
                  {settings.ctaText}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={settings.image}
              alt={settings.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
