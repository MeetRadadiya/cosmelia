import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Clinical Help",
  description: "Answers regarding LED wavelengths, peptide synergy, 60-day trial guarantees, and international courier dispatch.",
};

export default function FAQPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl">
        <Breadcrumbs items={[{ label: "Clinical Inquiries & FAQ" }]} />
        <FAQSection />
      </div>
    </div>
  );
}
