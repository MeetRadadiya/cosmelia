import React from "react";
import { Accordion } from "../ui/Accordion";

export const FAQSection: React.FC = () => {
  const faqItems = [
    {
      id: "faq-led-science",
      title: "How does 7-wavelength LED phototherapy stimulate dermal renewal?",
      content:
        "Red light (630nm) and deep near-infrared (850nm) penetrate the epidermis directly into the dermis, energizing the cytochrome c oxidase in cellular mitochondria. This accelerates adenosine triphosphate (ATP) synthesis, spurring fibroblast cells to multiply collagen and elastin production without thermal damage.",
    },
    {
      id: "faq-routine",
      title: "Can I use COSMELIA tools alongside retinols and chemical exfoliants?",
      content:
        "Yes. We recommend completing your LED light session on clean, dry skin first, followed by our Cellular Bio-Active Peptide Elixir to soothe and deeply infuse hydration before applying active retinoids or lipid crèmes.",
    },
    {
      id: "faq-trial",
      title: "What is the 60-Day In-Home Clinical Guarantee?",
      content:
        "We are confident in the measurable efficacy of our medical-grade instruments. If you do not observe visible improvements in skin elasticity, pore refinement, and glow within 60 days, return your device for a 100% refund, no questions asked.",
    },
    {
      id: "faq-shipping",
      title: "How fast is worldwide dispatch?",
      content:
        "All orders are processed from our temperature-controlled facility within 24 hours. Express tracked delivery takes 2-3 business days within the United States and 3-5 business days internationally.",
    },
    {
      id: "faq-fathershops",
      title: "How does this storefront integrate with FatherShops commerce?",
      content:
        "The storefront utilizes a decoupled headless architecture with a unified CommerceProvider interface. Products, catalog collections, customer carts, and checkout redirects bridge directly into FatherShops official store environments via dedicated adapter layers.",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container max-w-3xl">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Clinical Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#141416]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#5E6472]">
            Detailed answers regarding our medical-grade phototherapy, biological formulations, and guarantees.
          </p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-led-science" />
      </div>
    </section>
  );
};
