import React from "react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Cleanse & Prep",
      desc: "Start with a clean, fresh face to prepare your skin for a relaxing, mindful self-care routine.",
    },
    {
      step: "02",
      title: "Cool & Soothe",
      desc: "Use cooling ice globes or gentle face rollers to refresh tired skin and bring a calming sensation.",
    },
    {
      step: "03",
      title: "Target & Care",
      desc: "Apply gentle hydrocolloid patches or soothing eye pads for convenient, targeted at-home care.",
    },
    {
      step: "04",
      title: "Relax & Unwind",
      desc: "Incorporate a gentle facial massager or beauty device for a soothing, spa-like evening ritual.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Everyday Ritual
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">
            Make Self-Care Part of Your Everyday
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">
            Simple, versatile beauty tools designed to easily integrate into your morning and evening routines.
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
