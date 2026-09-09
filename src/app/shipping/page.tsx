import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | COSMELIA",
  description: "Estimated delivery timeframes, tracking, and shipping details for COSMELIA orders.",
};

export default function ShippingPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Shipping Policy" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Order Fulfillment
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Shipping & Delivery</h1>
          <p className="text-xs text-[#8B92A2]">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. Fulfillment Overview
            </h2>
            <p>
              At COSMELIA, we curate quality beauty tools and personal self-care accessories for customers across the United States. All orders placed through our storefront are fulfilled directly through our trusted supplier network coordinated via the FatherShops commerce platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Processing & Handling Times
            </h2>
            <p>
              Once your payment is authorized, orders enter our automated fulfillment workflow:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Order Processing Time:</strong> 1 to 3 business days (excluding weekends and statutory holidays).</li>
              <li>During peak holiday shopping periods or promotional events, processing may take up to 4 business days.</li>
              <li>You will receive an order confirmation email immediately upon purchase, followed by a dispatch confirmation containing your tracking number once your package has shipped.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Estimated Delivery Times
            </h2>
            <p>
              We partner with established international and domestic postal carriers (including USPS, ePacket, DHL eCommerce, and regional carriers) to deliver orders safely to your doorstep:
            </p>
            <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm space-y-2">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EAE8E1]">
                <span className="font-semibold text-[#141416]">United States (Continental)</span>
                <span className="text-[#8C734B] font-medium">7 – 15 business days</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#EAE8E1]">
                <span className="font-semibold text-[#141416]">Alaska, Hawaii & US Territories</span>
                <span className="text-[#8C734B] font-medium">10 – 20 business days</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#141416]">International Destinations</span>
                <span className="text-[#8C734B] font-medium">12 – 25 business days</span>
              </div>
            </div>
            <p className="text-[11px] text-[#8B92A2] italic">
              Please note: Delivery timelines are estimates based on standard transit conditions and may be influenced by weather events, carrier route congestion, or customs inspection delays.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              4. Order Tracking
            </h2>
            <p>
              Every order includes end-to-end postal tracking. As soon as your items are scanned by the carrier, tracking information will be emailed to you. You can also monitor your package anytime by entering your Order ID and email address on our Order Tracking page.
            </p>
            <p>
              Please allow 48 to 72 hours after dispatch for tracking events to update in the carrier&rsquo;s tracking portal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              5. Shipping Charges
            </h2>
            <p>
              Shipping fees (if applicable) are calculated during checkout based on your delivery destination and package weight. Any applicable delivery charges are clearly displayed before you confirm your payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              6. Split Shipments
            </h2>
            <p>
              If your order includes multiple items sourced from different supplier facilities within our network, your products may arrive in separate packages with distinct tracking numbers. There are no additional shipping charges for split packages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              7. Address Accuracy & Modifications
            </h2>
            <p>
              Please carefully review your shipping address before finalizing your order. Because orders are transmitted automatically to supplier fulfillment centers, address modifications can only be accommodated within 2 hours of placement. 
            </p>
            <p>
              COSMELIA is not responsible for delayed, undelivered, or misdelivered packages resulting from inaccurate address details provided at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              8. Damaged or Lost Packages
            </h2>
            <p>
              If your tracking indicates that your package was delivered but you cannot locate it, please check with household members and neighbors, and inspect surrounding building entrances. If your package is confirmed lost in transit or arrives with visible shipping damage, contact concierge@getcosmelia.com within 5 business days of the delivery scan so we can investigate with the carrier and assist with a replacement or resolution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              9. Questions & Support
            </h2>
            <p>For any questions regarding shipping, delivery timelines, or tracking status, please reach out to our team:</p>
            <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm space-y-1 text-xs text-[#141416]">
              <p><strong>COSMELIA Concierge Support</strong></p>
              <p>Email: <a href="mailto:concierge@getcosmelia.com" className="text-[#8C734B] hover:underline">concierge@getcosmelia.com</a></p>
              <p>Website: getcosmelia.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
