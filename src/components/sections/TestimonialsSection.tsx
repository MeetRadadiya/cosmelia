import React from "react";
import { RatingStars } from "../common/RatingStars";

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      author: "Victoria Sterling",
      location: "New York, NY",
      title: "Indistinguishable from my $350 in-office clinic visits",
      quote:
        "The Aura 7-Wave LED Mask has visibly smoothed fine lines around my forehead in 4 weeks. The 850nm near-infrared setting cleared lingering redness I had struggled with for years.",
      rating: 5,
      product: "Aura Luminescence 7-Wave LED Mask",
    },
    {
      author: "Dr. Jonathan Mercer, FAAD",
      location: "San Francisco, CA",
      title: "Clinically sound irradiance and diode density",
      quote:
        "As a board-certified dermatologist, I measure actual irradiance at skin surface. COSMELIA's 45 mW/cm² diode calibration achieves genuine photobiomodulation without tissue overheating.",
      rating: 5,
      product: "Aura Luminescence 7-Wave LED Mask",
    },
    {
      author: "Chloe Dubois",
      location: "Paris / Los Angeles",
      title: "The microcurrent contouring effect is instantaneous",
      quote:
        "Using the SculptPro with the Cellular Peptide Elixir before morning calls sculpts my jawline and completely depuffs my eyes. Pure daily luxury.",
      rating: 5,
      product: "SculptPro Sonic Microcurrent Wand",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Client Endorsements
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#141416]">
            Real Results. Measured Transformation.
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light">
            Read clinical observations and testimonials from aesthetic practitioners and verified patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm flex flex-col justify-between space-y-4 hover:border-[#C5A059] transition-colors"
            >
              <div className="space-y-3">
                <RatingStars rating={r.rating} />
                <h4 className="text-sm font-semibold text-[#141416]">{r.title}</h4>
                <p className="text-xs text-[#5E6472] leading-relaxed font-light">&ldquo;{r.quote}&rdquo;</p>
              </div>

              <div className="pt-4 border-t border-[#EAE8E1]/60">
                <div className="text-xs font-semibold text-[#141416]">{r.author}</div>
                <div className="text-[10px] text-[#8B92A2]">{r.location} • Verified Client</div>
                <div className="text-[10px] text-[#8C734B] font-medium mt-1">Verified: {r.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
