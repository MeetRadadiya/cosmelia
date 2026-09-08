import React from "react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Purify & Prime",
      desc: "Cleanse face thoroughly to allow pure, unimpeded photonic penetration into the dermal tissue.",
    },
    {
      step: "02",
      title: "10-Minute Phototherapy",
      desc: "Fasten the flexible platinum silicone Aura mask. Medical LEDs deliver 630nm & 850nm wavelengths directly to mitochondria.",
    },
    {
      step: "03",
      title: "Biomimetic Infusion",
      desc: "Apply Cellular Bio-Active Peptide Elixir. Post-light skin absorbs active molecules at 3x normal rate.",
    },
    {
      step: "04",
      title: "Sculpt & Seal",
      desc: "Use SculptPro 400µA microcurrent to lift facial contours and seal with Ceramide Lipid Barrier Crème.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            The 4-Step Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">Synergistic Clinical Routine</h2>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">
            Engineered to maximize cellular absorption and dermal collagen synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="relative p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-3">
              <span className="text-2xl font-serif font-bold text-[#C5A059]">{s.step}</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">{s.title}</h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
