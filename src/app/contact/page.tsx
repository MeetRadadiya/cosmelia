"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { siteConfig } from "@/lib/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl">
        <Breadcrumbs items={[{ label: "Client Concierge" }]} />

        <div className="py-8 border-b border-[#EAE8E1] space-y-3 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">Client Concierge</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">Personal Aesthetic Consultation</h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-lg mx-auto">
            Our Beverly Hills clinical concierge team is available to guide your custom wavelength protocol, order
            tracking, and formulation regimen.
          </p>
        </div>

        <div className="py-10 flex justify-center items-center">
          <div className="md:w-1/2 w-full bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EBF1ED] text-[#2D5A43] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-serif text-[#141416]">Inquiry Dispatched</h3>
                <p className="text-xs text-[#5E6472]">
                  A dedicated COSMELIA concierge will respond within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name" required placeholder="Elena Vance" />
                <Input label="Email Address" type="email" required placeholder="client@cosmelia.com" />
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-[#141416]/80">
                    Your Inquiries or Treatment Questions
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your current routine or product inquiry..."
                    className="w-full px-4 py-3 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
                  Submit Consultation Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
