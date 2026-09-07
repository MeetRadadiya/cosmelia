import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "COSMELIA patron data protection and privacy manifesto.",
};

export default function PrivacyPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Legal Manifesto
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Privacy Policy</h1>
          <p className="text-xs text-[#8B92A2]">Effective Date: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. Information Collection
            </h2>
            <p>
              COSMELIA values the discretion of our patrons. When you purchase our clinical phototherapy instruments, subscribe to our private registry, or consult with our aesthetic concierge, we collect necessary identifiers (name, shipping destination, encrypted payment details).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Commerce Processing & FatherShops Integration
            </h2>
            <p>
              Your transactional data is securely processed via certified, 256-bit encrypted channels. When integrated with FatherShops commerce backends, data transmission strictly conforms to international privacy laws including GDPR and CCPA.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Zero Data Brokering
            </h2>
            <p>
              COSMELIA does not sell, rent, or trade patron records or biometric routines to third-party advertisers. Your information is utilized solely to facilitate clinical fulfillment and personalized consultation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
