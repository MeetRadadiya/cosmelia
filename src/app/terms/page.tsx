import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions governing COSMELIA clinical purchases and in-home trials.",
};

export default function TermsPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Terms of Service" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Legal Manifesto
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Terms of Service</h1>
          <p className="text-xs text-[#8B92A2]">Effective Date: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. General Agreement
            </h2>
            <p>
              By accessing the COSMELIA portal and purchasing our clinical instruments, you agree to comply with our Terms of Service and guidelines for non-invasive aesthetic phototherapy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. 60-Day Clinical Trial & Returns
            </h2>
            <p>
              Each customer is eligible for one 60-day clinical trial per device modality. If you are unsatisfied with your dermal transformation, you may return the device in original packaging for a full refund minus return shipping costs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Device Safety & Non-Medical Advice
            </h2>
            <p>
              While our devices are Class II medical-grade and FDA cleared for wellness and collagen stimulation, our content does not constitute formal medical diagnosis or replace consultation with your board-certified dermatologist.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
