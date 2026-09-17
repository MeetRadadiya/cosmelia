import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Product Disclaimer | COSMELIA",
  description:
    "Important information regarding consumer product use, non-medical advice, and individual results.",
  alternates: {
    canonical: "https://getcosmelia.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Disclaimer" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Product Transparency
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">
            Product & Usage Disclaimer
          </h1>
          <p className="text-xs text-[#8B92A2]">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. General Consumer & Cosmetic Use
            </h2>
            <p>
              The products offered on COSMELIA (including, without limitation,
              facial massagers, cooling globes, ice rollers, hydrocolloid
              blemish patches, eye pads, and light beauty devices) are designed
              and sold strictly for personal cosmetic, beauty, and relaxation
              self-care routines.
            </p>
            <p>
              These products are <strong>not</strong> medical devices, surgical
              equipment, or prescription treatments. They are not intended,
              designed, or licensed to diagnose, treat, cure, mitigate, or
              prevent any disease, illness, chronic skin condition, or medical
              disorder.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. No Medical Advice
            </h2>
            <p>
              All content provided on getcosmelia.com—including product
              descriptions, blog posts, routine suggestions, images, and
              customer service communications—is published for general
              informational and educational lifestyle purposes only.
            </p>
            <p>
              Nothing on this Website should be construed as or relied upon as
              medical, dermatological, or clinical advice. If you have sensitive
              skin, allergies, active skin lesions, eczema, rosacea, open
              wounds, implantable electronic devices (such as pacemakers), or
              are pregnant or nursing, consult a qualified physician or
              board-certified dermatologist prior to using any beauty or massage
              accessories.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Individual Results May Vary
            </h2>
            <p>
              Skin types, sensitivities, and responses to beauty accessories
              differ significantly between individuals. We do not make any
              guarantees, warranties, or representations regarding specific
              outcomes, timelines, or permanent alterations to skin appearance.
              Results depend on numerous factors, including individual
              lifestyle, skin type, consistency of routine, and appropriate
              usage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              4. Manufacturer Instructions & Customer Responsibility
            </h2>
            <p>
              Customers are solely responsible for carefully reading and
              following all instructions, operating guidelines, safety warnings,
              and ingredient lists enclosed with each product before initial
              use.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Patch Testing:</strong> We strongly advise conducting a
                small patch test on a non-sensitive area of skin before full
                facial application of topical patches or pads.
              </li>
              <li>
                <strong>Safe Device Operation:</strong> Do not use electrical
                beauty devices in or around standing water, bathtubs, or showers
                unless specifically rated as waterproof by the manufacturer.
              </li>
              <li>
                <strong>Discontinue Use:</strong> If you experience redness,
                burning, irritation, pain, or discomfort at any point during or
                after using a product, discontinue use immediately and seek
                professional medical guidance if symptoms persist.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              5. Sourcing & Supplier Information
            </h2>
            <p>
              COSMELIA curates and sells products fulfilled through established
              third-party supplier channels via the FatherShops commerce
              platform. Product packaging, physical markings, and included
              instructional materials are prepared by third-party manufacturers.
              While we aim to provide accurate and up-to-date descriptions,
              actual product packaging and materials may contain additional or
              different information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              6. Questions & Inquiries
            </h2>
            <p>
              If you have any questions regarding product materials, usage
              recommendations, or this disclaimer, please contact us:
            </p>
            <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm space-y-1 text-xs text-[#141416]">
              <p>
                <strong>COSMELIA Support</strong>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:radadiyameet366@gmail.com"
                  className="text-[#8C734B] hover:underline"
                >
                  radadiyameet366@gmail.com
                </a>
              </p>
              <p>Website: getcosmelia.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
