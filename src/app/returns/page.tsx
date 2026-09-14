import React from "react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ReturnForm } from "@/components/returns/ReturnForm";

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy | Cosmelia Luxury Skincare",
  description:
    "Request an RMA number and review our seamless 14-30 day returns & exchange policies for Cosmelia luxury skincare products.",
  alternates: {
    canonical: "https://getcosmelia.com/returns",
  },
  openGraph: {
    title: "Returns & Exchanges Policy | Cosmelia Luxury Skincare",
    description:
      "Easy and seamless returns for Cosmelia luxury beauty tools & skincare.",
    url: "https://getcosmelia.com/returns",
    siteName: "Cosmelia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Returns & Exchanges Policy | Cosmelia",
    description:
      "Easy and seamless returns for Cosmelia luxury beauty tools & skincare.",
  },
};

export default function ReturnsPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl space-y-8">
        <Breadcrumbs items={[{ label: "Returns & Exchanges" }]} />

        <div className="pb-4 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Customer Satisfaction
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">
            Returns & Exchanges Policy
          </h1>
          <p className="text-xs text-[#8B92A2]">Last Updated: September 2026</p>
        </div>

        {/* Policy Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#EAE8E1] p-6 rounded-sm text-xs text-[#5E6472]">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#141416] text-xs uppercase tracking-wider">
              1. 14–30 Day Window
            </h3>
            <p className="leading-relaxed font-light">
              Return requests must be initiated within 14 days of delivery for
              standard items, or within 30 days for factory-defective
              merchandise.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#141416] text-xs uppercase tracking-wider">
              2. Hygiene & Condition
            </h3>
            <p className="leading-relaxed font-light">
              Due to the personal nature of beauty tools and skincare
              accessories, returned items must be unused, unwashed, and in
              original packaging with seals intact.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#141416] text-xs uppercase tracking-wider">
              3. Damaged on Arrival
            </h3>
            <p className="leading-relaxed font-light">
              If an item arrives damaged or incorrect, contact us
              within 48–72 hours with photos for a prompt replacement or full refund.
            </p>
          </div>
        </div>

        {/* RMA Form Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-serif text-[#141416]">
              Request an RMA Number
            </h2>
            <p className="text-xs text-[#5E6472]">
              Please complete the official Return Merchandise Authorization
              (RMA) form below to receive return shipping instructions.
            </p>
          </div>

          <ReturnForm />
        </div>
      </div>
    </div>
  );
}
