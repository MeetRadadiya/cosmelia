import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | COSMELIA",
  description: "Learn about COSMELIA's mission to curate accessible, modern beauty tools and self-care accessories.",
};

export default function AboutPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl space-y-12">
        <Breadcrumbs items={[{ label: "About COSMELIA" }]} />

        {/* Hero Banner */}
        <div className="py-8 border-b border-[#EAE8E1] space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#141416]">
            Everyday Beauty &amp; Mindful Self-Care
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
            Thoughtfully selected beauty tools and accessories designed to make your daily home routines simple, soothing, and accessible.
          </p>
        </div>

        {/* Feature Image */}
        <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-[#EAE8E1] shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
            alt="Cosmelia Beauty and Self-Care Lifestyle"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Core Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#141416]">
              Thoughtful Curation
            </h2>
            <p>
              COSMELIA was founded with a straightforward goal: to take the guesswork out of finding reliable, easy-to-use beauty tools and personal self-care accessories. In a world full of complex steps and overwhelming claims, we believe at-home self-care should feel refreshing and straightforward.
            </p>
            <p>
              We search and curate versatile items—from cooling facial rollers and soothing eye pads to hydrocolloid blemish patches and gentle beauty light tools—that seamlessly complement your existing skincare ritual.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#141416]">
              Made for Everyday Living
            </h2>
            <p>
              We don&rsquo;t believe self-care should require hours of spare time or complicated clinic appointments. A five-minute morning ice roller session or a comforting evening massager routine can bring calm, clarity, and care to your everyday routine.
            </p>
            <p>
              Through our fulfillment partnership with FatherShops, we deliver our curated catalog directly to customers across the United States with tracked shipping and dedicated customer support.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="p-8 bg-white border border-[#EAE8E1] rounded-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-xl font-serif text-[#141416]">What Guides Us</h3>
            <p className="text-xs text-[#5E6472] font-light">The principles behind everything we curate for your home.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs text-[#5E6472]">
            <div className="space-y-2 text-center p-4 bg-[#FAF9F6] rounded-sm">
              <span className="text-lg text-[#C5A059]">✦</span>
              <h4 className="font-semibold text-[#141416]">Careful Selection</h4>
              <p className="font-light leading-relaxed">Every tool in our catalog is chosen for practical daily usability, comfort, and quality.</p>
            </div>
            <div className="space-y-2 text-center p-4 bg-[#FAF9F6] rounded-sm">
              <span className="text-lg text-[#C5A059]">◈</span>
              <h4 className="font-semibold text-[#141416]">Honest Information</h4>
              <p className="font-light leading-relaxed">Clear, factual descriptions with realistic guidance and zero exaggerated claims.</p>
            </div>
            <div className="space-y-2 text-center p-4 bg-[#FAF9F6] rounded-sm">
              <span className="text-lg text-[#C5A059]">❖</span>
              <h4 className="font-semibold text-[#141416]">Dedicated Care</h4>
              <p className="font-light leading-relaxed">Attentive customer support to answer questions and ensure a smooth shopping experience.</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link href="/products">
              <Button variant="primary" size="md">
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
