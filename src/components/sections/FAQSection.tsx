import React from "react";
import { Accordion } from "../ui/Accordion";

export const FAQSection: React.FC = () => {
  const faqItems = [
    {
      id: "faq-products",
      title: "What products does Cosmelia offer?",
      content:
        "Cosmelia curates accessible beauty tools and self-care accessories, including facial massagers, cooling ice rollers, hydrocolloid blemish patches, and home skincare devices designed to complement your everyday routines.",
    },
    {
      id: "faq-usage",
      title: "How do I use these beauty tools in my routine?",
      content:
        "Each product includes manufacturer instructions for safe and comfortable use. We recommend starting on clean skin and integrating tools gently into your morning or evening relaxation rituals.",
    },
    {
      id: "faq-shipping",
      title: "What are your shipping and delivery timeframes?",
      content:
        "Orders are typically processed within 1–3 business days. Delivery to addresses in the United States generally takes 7–15 business days via tracked postal carriers, depending on your location and carrier schedule.",
    },
    {
      id: "faq-tracking",
      title: "How can I track my order?",
      content:
        "Once your order ships, an automated confirmation email with tracking details will be sent to you. You can also view status updates anytime on our Order Tracking page or by contacting customer support.",
    },
    {
      id: "faq-returns",
      title: "What is your return and refund policy?",
      content:
        "Eligible items may be returned within our return window provided they are unused, in original packaging, and with hygiene seals intact. Defective items can be reported to support for prompt assistance.",
    },
    {
      id: "faq-support",
      title: "How can I get in touch with customer service?",
      content:
        "Our customer care team is available by email at concierge@getcosmelia.com or via the contact form on our website. We aim to respond to all inquiries within 24–48 business hours.",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] border-b border-[#EAE8E1]">
      <div className="luxury-container max-w-3xl">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Help & Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#141416]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#5E6472]">
            Clear answers regarding our curated beauty tools, orders, shipping, and customer care.
          </p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-products" />
      </div>
    </section>
  );
};
