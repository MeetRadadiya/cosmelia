import React from "react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { TrackOrderView } from "@/components/track/TrackOrderView";

export const metadata: Metadata = {
  title: "Track Your Order | Cosmelia Luxury Skincare",
  description:
    "Check real-time shipment status, carrier updates, and delivery timelines for your Cosmelia luxury skincare & beauty orders.",
  alternates: {
    canonical: "https://getcosmelia.com/track-order",
  },
  openGraph: {
    title: "Track Your Order | Cosmelia Luxury Skincare",
    description:
      "Real-time shipment tracking for your Cosmelia orders.",
    url: "https://getcosmelia.com/track-order",
    siteName: "Cosmelia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Track Your Order | Cosmelia",
    description: "Real-time shipment tracking for Cosmelia orders.",
  },
};

export default function TrackOrderPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: "Track Order" }]} />

        <div className="text-center space-y-3 mb-10 py-4">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Client Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            Track Your Order Status
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-md mx-auto">
            Enter your Order ID and billing Email Address below to view
            real-time shipment progress.
          </p>
        </div>

        <TrackOrderView />
      </div>
    </div>
  );
}
