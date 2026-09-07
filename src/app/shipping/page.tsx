import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping & Carbon-Neutral Logistics",
  description: "COSMELIA worldwide express courier delivery and customs handling.",
};

export default function ShippingPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Shipping Policy" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Logistics Manifesto
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Shipping & Handling</h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. 24-Hour Dispatch
            </h2>
            <p>
              All orders are hand-inspected in our temperature-controlled facility and dispatched via express tracked courier within 24 business hours.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Complimentary Express Shipping
            </h2>
            <p>
              Orders exceeding $100 receive complimentary express air shipping worldwide. Standard shipping is a flat rate of $9.95 for orders below the threshold.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Carbon-Neutral Guarantee
            </h2>
            <p>
              Every shipment is 100% carbon-offset in partnership with verified forest preservation and carbon capture initiatives.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
