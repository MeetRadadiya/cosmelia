import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Customer Support",
  description:
    "Find answers about our curated beauty tools, daily routine recommendations, order tracking, shipping, and returns.",
  alternates: {
    canonical: "https://getcosmelia.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Cosmelia",
    description:
      "Find answers about our curated beauty tools, daily routine recommendations, order tracking, shipping, and returns.",
    url: "https://getcosmelia.com/faq",
    siteName: "Cosmelia",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What products does Cosmelia offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cosmelia curates accessible beauty tools and self-care accessories, including facial massagers, cooling ice rollers, hydrocolloid blemish patches, and home skincare devices designed to complement your everyday routines.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use these beauty tools in my routine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each product includes manufacturer instructions for safe and comfortable use. We recommend starting on clean skin and integrating tools gently into your morning or evening relaxation rituals.",
      },
    },
    {
      "@type": "Question",
      name: "What are your shipping and delivery timeframes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orders are typically processed within 1–3 business days. Delivery to addresses in the United States generally takes 7–15 business days via tracked postal carriers, depending on your location and carrier schedule.",
      },
    },
    {
      "@type": "Question",
      name: "How can I track my order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once your order ships, an automated confirmation email with tracking details will be sent to you. You can also view status updates anytime on our Order Tracking page or by contacting customer support.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return and refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eligible items may be returned within our return window provided they are unused, in original packaging, and with hygiene seals intact. Defective items can be reported to support for prompt assistance.",
      },
    },
    {
      "@type": "Question",
      name: "How can I get in touch with customer service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our customer care team is available by email at radadiyameet366@gmail.com or via the contact form on our website. We aim to respond to all inquiries within 24–48 business hours.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="luxury-container max-w-4xl">
        <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />
        <FAQSection />
      </div>
    </div>
  );
}
