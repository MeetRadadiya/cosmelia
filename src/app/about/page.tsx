import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Aesthetic Philosophy & Clinical Science",
  description: "Learn how COSMELIA marries medical phototherapy with cellular biotechnology.",
};

export default function AboutPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl space-y-12">
        <Breadcrumbs items={[{ label: "About COSMELIA" }]} />

        <div className="py-8 border-b border-[#EAE8E1] space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Our Foundation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#141416]">
            Photomedicine Meets Dermal Vitality
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">
            Crafting clinical instruments and biomimetic formulations that awaken cellular regeneration from within.
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-[#EAE8E1] shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
            alt="COSMELIA Laboratory"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#141416]">
              Clinical Diode Engineering
            </h2>
            <p>
              Traditional at-home beauty devices fail to achieve clinical transformation due to dispersed beam angles and improper irradiance. At COSMELIA, our engineers work alongside board-certified dermatologists to calibrate high-precision narrow-band diodes at 630nm and 850nm.
            </p>
            <p>
              Every device delivers clinical-grade energy straight to the mitochondria, activating cellular ATP synthesis without thermal trauma or UV radiation.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#141416]">
              Bio-Identical Peptide Nutrients
            </h2>
            <p>
              Light phototherapy dramatically opens cellular receptor pathways. We formulate our botanical bio-ferments and copper peptides to synergize directly with our LED devices, multiplying transdermal penetration by 300%.
            </p>
            <p>
              Our lipid barrier creams mimic the natural 3:1:1 lipid structure of the stratum corneum, locking in clinical hydration for continuous 72-hour resilience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
