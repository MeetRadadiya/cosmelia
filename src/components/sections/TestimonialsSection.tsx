import React from "react";
import Link from "next/link";

export const TestimonialsSection: React.FC = () => {
  const pillars = [
    {
      number: "01",
      title: "Curated Selection",
      description:
        "We focus on practical beauty and self-care products that fit easily and naturally into everyday routines.",
      icon: "✦",
    },
    {
      number: "02",
      title: "Everyday Self-Care",
      description:
        "Simple, gentle tools designed to complement your personal skincare rituals and mindful moments at home.",
      icon: "◈",
    },
    {
      number: "03",
      title: "Easy Online Shopping",
      description:
        "Browse, discover, and order from the comfort of home with clear product details and secure checkout.",
      icon: "❖",
    },
    {
      number: "04",
      title: "Customer Support",
      description:
        "Our team is here to assist with any questions about your order, shipping, or product details.",
      icon: "✦",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Our Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">
            Why Choose Cosmelia?
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">
            Bringing accessible self-care tools and dependable online shopping to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm flex flex-col justify-between space-y-4 hover:border-[#C5A059] transition-all hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#8C734B]">{pillar.number}</span>
                  <span className="text-sm text-[#C5A059]">{pillar.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#141416]">{pillar.title}</h3>
                <p className="text-xs text-[#5E6472] leading-relaxed font-light">{pillar.description}</p>
              </div>

              <div className="pt-3 border-t border-[#EAE8E1]/60">
                <Link
                  href="/products"
                  className="text-[11px] font-semibold text-[#141416] hover:text-[#8C734B] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Explore Products</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
