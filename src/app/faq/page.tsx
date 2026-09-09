import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Customer Support",
  description: "Find answers about our curated beauty tools, daily routine recommendations, order tracking, shipping, and returns.",
};

export default function FAQPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl">
        <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />
        <FAQSection />
      </div>
    </div>
  );
}
