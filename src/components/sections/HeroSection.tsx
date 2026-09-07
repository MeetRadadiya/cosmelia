import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSettings } from "../../lib/config/sections";
import { Button } from "../ui/Button";

export const HeroSection: React.FC<{ settings: HeroSettings }> = ({ settings }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EEE5] text-[#825E36] rounded-full border border-[#E8D5C4] text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#825E36]" />
              {settings.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-[#141416] leading-[1.1]">
              {settings.headline} <br />
              <span className="italic font-light text-[#8C734B]">{settings.highlightedWord}</span>
            </h1>

            <p className="text-sm md:text-base text-[#5E6472] font-light max-w-lg leading-relaxed">
              {settings.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link href={settings.primaryCtaLink}>
                <Button variant="primary" size="lg">
                  {settings.primaryCtaText}
                </Button>
              </Link>
              <Link href={settings.secondaryCtaLink}>
                <Button variant="secondary" size="lg">
                  {settings.secondaryCtaText}
                </Button>
              </Link>
            </div>

            {/* Clinical Trust Metrics */}
            <div className="pt-8 border-t border-[#EAE8E1] grid grid-cols-3 gap-6">
              {settings.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-xl md:text-2xl font-serif font-semibold text-[#141416]">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-[11px] text-[#8B92A2] uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual Area */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border border-[#EAE8E1]">
              <Image
                src={settings.heroImage}
                alt={settings.heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-sm shadow-xl border border-[#EAE8E1] hidden sm:flex items-center gap-3 max-w-xs z-10">
              <div className="w-10 h-10 rounded-full bg-[#F4EEE5] flex items-center justify-center text-[#825E36] flex-shrink-0 font-serif text-lg">
                ✦
              </div>
              <div>
                <p className="text-xs font-semibold text-[#141416]">Dermatologist Verified</p>
                <p className="text-[10px] text-[#5E6472]">Zero UV • 100% Non-Invasive Photomedicine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
