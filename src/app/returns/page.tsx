import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Returns & 60-Day Trial",
  description: "COSMELIA 60-day in-home trial and clinical return guidelines.",
};

export default function ReturnsPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Returns Policy" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Client Guarantee
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Returns & 60-Day In-Home Trial</h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. 60-Day Clinical Trial
            </h2>
            <p>
              We want you to experience visible, tangible dermal transformation. You have a full 60 days from delivery to evaluate your COSMELIA LED or microcurrent device.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Hassle-Free Initiations
            </h2>
            <p>
              To initiate an exchange or return, simply contact {siteConfig.supportEmail} with your order number. Our team will issue a pre-paid insured return shipping label within 4 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
