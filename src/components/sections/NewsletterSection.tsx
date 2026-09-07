"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { trackEvent } from "../../lib/analytics";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      trackEvent("newsletter_signup", { email });
    }, 600);
  };

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container max-w-2xl text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Private Concierge Registry
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#141416]">
          Receive Dermal Insights & Exclusive Allocations
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-lg mx-auto leading-relaxed">
          Subscribe to receive peer-reviewed dermatological white papers, priority access to new device drops, and private archival invitations.
        </p>

        {status === "success" ? (
          <div className="p-4 bg-[#EBF1ED] border border-[#D0DFD6] rounded-sm text-[#2D5A43] text-xs font-medium animate-fadeIn">
            ✓ Welcome to the COSMELIA Private Registry. Your complimentary welcome guide has been dispatched.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={status === "loading"}
              className="sm:w-auto"
            >
              Join Registry
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="text-[11px] text-red-600">Please enter a valid email address.</p>
        )}

        <p className="text-[10px] text-[#8B92A2] tracking-wide">
          We honor your sanctuary. Zero spam. Unsubscribe with a single click at any time.
        </p>
      </div>
    </section>
  );
};
