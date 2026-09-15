import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | COSMELIA Curated Beauty & Skincare Store",
  description:
    "Learn how COSMELIA curates top trending skincare tools, ice globes, pimple patches, eye masks, and LED massagers with fast tracked US shipping.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-16">
      {/* Top Navigation Breadcrumbs */}
      <div className="luxury-container pt-6 pb-2">
        <Breadcrumbs items={[{ label: "About COSMELIA" }]} />
      </div>

      {/* Hero Header Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="luxury-container max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C734B]/10 border border-[#8C734B]/20 text-[#8C734B] text-[11px] uppercase tracking-[0.2em] font-semibold">
            <span>✦ CURATED BEAUTY &amp; SKINCARE DESTINATION ✦</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#141416] tracking-tight leading-tight max-w-4xl mx-auto">
            Handpicked Beauty Innovations <br className="hidden sm:inline" />
            <span className="italic text-[#8C734B] font-light">
              Delivered Directly to Your Door
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#5E6472] font-light leading-relaxed max-w-2xl mx-auto">
            At COSMELIA, we search and curate top-trending skincare tools—from
            cooling facial ice globes and hydrocolloid acne patches to collagen
            eye masks and LED light therapy devices—making effective at-home
            self-care effortless and accessible.
          </p>
        </div>

        {/* Hero Banner Showcase */}
        <div className="luxury-container max-w-6xl mt-8">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-sm overflow-hidden border border-[#EAE8E1] shadow-2xl group">
            <Image
              src="/images/about/about-hero-banner.png"
              alt="Curated Skincare & Beauty Tools Collection Showcase"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating Glassmorphism Trust Badges */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/90 backdrop-blur-md border border-white/50 p-4 sm:p-6 rounded-sm shadow-xl max-w-md">
              <div className="grid grid-cols-3 gap-4 text-center divide-x divide-[#EAE8E1]">
                <div>
                  <div className="text-lg sm:text-xl font-serif font-semibold text-[#141416]">
                    Curated
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8C734B] font-medium">
                    Top Quality
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-serif font-semibold text-[#141416]">
                    4.9 ★
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8C734B] font-medium">
                    Reviews
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-serif font-semibold text-[#141416]">
                    Tracked
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8C734B] font-medium">
                    US Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Category Innovations Section */}
      <section className="py-12 bg-white border-y border-[#EAE8E1]">
        <div className="luxury-container max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Our Curated Selection
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#141416]">
              Trending Tools for Glowing Skin
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6472] font-light">
              We handpick reliable skincare accessories that deliver visible
              results to elevate your daily routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Ice Globes & Rollers */}
            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-4 hover:border-[#8C734B]/60 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-white border border-[#8C734B]/30 flex items-center justify-center text-[#8C734B] text-xl font-serif">
                ❄
              </div>
              <h3 className="text-base font-serif font-semibold text-[#141416]">
                Ice Globes &amp; Cryo Rollers
              </h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                Cooling glass facial massagers chosen to relieve morning
                puffiness, boost circulation, and soothe skin with instant cold
                therapy.
              </p>
            </div>

            {/* Card 2: Hydrocolloid Pimple Patches */}
            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-4 hover:border-[#8C734B]/60 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-white border border-[#8C734B]/30 flex items-center justify-center text-[#8C734B] text-xl font-serif">
                ✦
              </div>
              <h3 className="text-base font-serif font-semibold text-[#141416]">
                Blemish &amp; Pimple Patches
              </h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                Ultra-thin, hydrocolloid blemish covers selected to absorb
                impurities, protect breakout spots, and promote clear skin.
              </p>
            </div>

            {/* Card 3: Eye Patches & Masks */}
            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-4 hover:border-[#8C734B]/60 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-white border border-[#8C734B]/30 flex items-center justify-center text-[#8C734B] text-xl font-serif">
                ◈
              </div>
              <h3 className="text-base font-serif font-semibold text-[#141416]">
                Hydrogel Eye Patches
              </h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                Hydrating collagen under-eye pads sourced to refresh tired eyes,
                minimize dark circles, and smooth fine lines effortlessly.
              </p>
            </div>

            {/* Card 4: LED Masks & Massagers */}
            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-4 hover:border-[#8C734B]/60 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-white border border-[#8C734B]/30 flex items-center justify-center text-[#8C734B] text-xl font-serif">
                ❖
              </div>
              <h3 className="text-base font-serif font-semibold text-[#141416]">
                LED Light &amp; Neck Massagers
              </h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                Modern light therapy face masks and thermal massagers selected
                for micro-current stimulation and skin-firming benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Operate / Dropshipping Model Explanation Section */}
      <section className="py-16">
        <div className="luxury-container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden border border-[#EAE8E1] shadow-xl group">
                <Image
                  src="/images/about/routine-banner.png"
                  alt="Enjoying At-Home Skincare Routine"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
                />
              </div>
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
                How COSMELIA Works
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-[#141416] leading-tight">
                Curating the Best in Skincare &amp; Delivering Direct to You
              </h2>

              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
                As a specialized online skincare destination, we focus on
                identifying the most effective beauty tools from top global
                manufacturers and making them easily accessible in one place.
              </p>

              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
                We partner with established fulfillment networks and FatherShops
                to process and ship your orders with tracked delivery across the
                United States. You get verified quality, direct pricing, and
                dedicated customer support every step of the way.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button variant="primary" size="md">
                    Explore All Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="md">
                    Contact Customer Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values / Dropshipping Trust Pillars */}
      <section className="py-12 bg-white border-t border-[#EAE8E1]">
        <div className="luxury-container max-w-5xl space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-2xl font-serif text-[#141416]">
              Why Shop With COSMELIA
            </h3>
            <p className="text-xs text-[#5E6472] font-light">
              Our commitment to quality curation, transparent service, and
              customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-[#5E6472]">
            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#8C734B]/10 text-[#8C734B] flex items-center justify-center mx-auto text-lg font-serif">
                🔍
              </div>
              <h4 className="font-serif font-semibold text-[#141416] text-sm">
                Strict Product Selection
              </h4>
              <p className="font-light leading-relaxed">
                We test and select products based on material safety, daily
                practical utility, and real customer feedback.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#8C734B]/10 text-[#8C734B] flex items-center justify-center mx-auto text-lg font-serif">
                📦
              </div>
              <h4 className="font-serif font-semibold text-[#141416] text-sm">
                Direct Tracked Shipping
              </h4>
              <p className="font-light leading-relaxed">
                Shipped directly from verified manufacturing and distribution
                hubs with full end-to-end tracking.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#8C734B]/10 text-[#8C734B] flex items-center justify-center mx-auto text-lg font-serif">
                🛡️
              </div>
              <h4 className="font-serif font-semibold text-[#141416] text-sm">
                Dedicated Buyer Care
              </h4>
              <p className="font-light leading-relaxed">
                Our support team is always ready to assist with order tracking,
                product questions, and hassle-free returns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
