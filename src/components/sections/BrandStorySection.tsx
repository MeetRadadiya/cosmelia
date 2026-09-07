import React from "react";
import Image from "next/image";
import { BrandStorySettings } from "../../lib/config/sections";

export const BrandStorySection: React.FC<{ settings: BrandStorySettings }> = ({ settings }) => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square rounded-sm overflow-hidden border border-[#EAE8E1] shadow-xl">
            <Image
              src={settings.image}
              alt="COSMELIA Aesthetic Research"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              {settings.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#141416] leading-snug">
              {settings.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
              {settings.paragraph1}
            </p>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
              {settings.paragraph2}
            </p>

            <blockquote className="pt-4 border-t border-[#EAE8E1] space-y-2">
              <p className="font-serif italic text-sm md:text-base text-[#141416]">
                &ldquo;{settings.quote}&rdquo;
              </p>
              <footer className="text-[11px] uppercase tracking-wider text-[#8C734B] font-semibold">
                — {settings.author}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
