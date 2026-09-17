import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service | COSMELIA",
  description:
    "Terms and conditions governing your use of COSMELIA and order purchases.",
  alternates: {
    canonical: "https://getcosmelia.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Terms of Service" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Customer Agreement
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#8B92A2]">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally
              binding agreement between you and COSMELIA (&ldquo;we,&rdquo;
              &ldquo;our,&rdquo; or &ldquo;us&rdquo;) governing your access to
              and use of getcosmelia.com (the &ldquo;Website&rdquo;) and all
              associated purchases of beauty tools and self-care accessories.
            </p>
            <p>
              By accessing our Website, creating an account, or placing an
              order, you confirm that you are at least 18 years of age (or the
              legal age of majority in your jurisdiction) and agree to be bound
              by these Terms and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Business Model & Product Sourcing
            </h2>
            <p>
              COSMELIA operates as an online curator and retailer of beauty
              accessories and self-care tools. We do <strong>not</strong>{" "}
              manufacture, develop, patent, or formulate the products offered on
              this Website.
            </p>
            <p>
              Products are sourced and fulfilled through our commerce and
              supplier network powered by FatherShops. All products are
              delivered directly from supplier fulfillment facilities to you. We
              make every reasonable effort to describe items accurately based on
              supplier specifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Product Information & Non-Medical Use
            </h2>
            <p>
              All products offered on COSMELIA (including facial rollers,
              massagers, hydrocolloid patches, eye pads, and LED beauty devices)
              are intended strictly for general cosmetic, lifestyle, and home
              self-care routines.
            </p>
            <p>
              <strong>Important Disclaimer:</strong> Products sold on this
              Website are <strong>not</strong> medical devices, are not intended
              to diagnose, treat, cure, or prevent any disease, dermatological
              condition, or health disorder, and should never replace
              consultation with a licensed dermatologist or medical
              professional. Always follow the manufacturer&rsquo;s instructions
              and warnings enclosed with each item.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              4. Pricing, Currency & Availability
            </h2>
            <p>
              All prices listed on the Website are shown in US Dollars (USD) by
              default, with optional multi-currency conversion provided for
              customer convenience. While we strive to ensure accurate pricing,
              errors may occasionally occur. If an item is listed at an
              incorrect price due to technical error, we reserve the right to
              cancel orders placed for that item and issue a full refund.
            </p>
            <p>
              Product availability is subject to change without notice. In the
              event an ordered product becomes unavailable from supplier stock,
              we will notify you and promptly refund your payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              5. Orders & Acceptance
            </h2>
            <p>
              Your placement of an order constitutes an offer to purchase. Order
              confirmation emails acknowledge receipt of your order but do not
              signify final acceptance. We reserve the right to refuse or limit
              orders for reasons including, but not limited to, suspected
              fraudulent activity, unauthorized reseller behavior, or shipping
              restrictions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              6. Shipping & Delivery
            </h2>
            <p>
              Orders are fulfilled through partner supplier networks. Typical
              order processing takes 1–3 business days. Estimated standard
              delivery to US addresses is 7–15 business days. Delivery dates are
              estimates and are not guaranteed, as carrier logistics and customs
              clearance can affect transit times.
            </p>
            <p>
              Risk of loss and title for items pass to you upon delivery by the
              carrier to the destination address specified in your order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              7. Returns, Refunds & RMA
            </h2>
            <p>
              We want you to have a positive experience. Eligible items may be
              returned within our return window provided they are unused, in
              original packaging, and with protective seals intact (due to the
              personal hygiene nature of skincare and beauty tools).
            </p>
            <p>
              All returns must be initiated through our Return Merchandise
              Authorization (RMA) process on the Returns page. Items returned
              without authorization may not be eligible for refund. Please refer
              to our complete Returns Policy for detailed instructions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              8. Intellectual Property
            </h2>
            <p>
              The COSMELIA brand name, logo, custom graphics, website layouts,
              and curated editorial content are the exclusive intellectual
              property of COSMELIA. Product trademarks, supplier images, and
              brand assets remain the property of their respective owners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, COSMELIA and
              its affiliates, directors, employees, and fulfillment partners
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of your use of the
              Website or purchased products.
            </p>
            <p>
              In no event shall our total aggregate liability exceed the total
              amount paid by you for the specific order giving rise to the
              claim. Nothing in these Terms attempts to limit or exclude
              statutory consumer rights that cannot be waived under applicable
              law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              10. Governing Law
            </h2>
            <p>
              These Terms and any disputes arising out of your purchase or use
              of the Website shall be governed by and construed in accordance
              with the laws of the United States and the State where our
              business is registered, without regard to conflict of law
              principles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              11. Contact Us
            </h2>
            <p>
              For questions or assistance regarding these Terms, please contact
              our support team:
            </p>
            <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm space-y-1 text-xs text-[#141416]">
              <p>
                <strong>COSMELIA Customer Support</strong>
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
