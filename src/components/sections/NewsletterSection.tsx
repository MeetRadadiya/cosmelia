"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { trackEvent } from "../../lib/analytics";
import { useAccount } from "../../lib/context/AccountContext";

export const NewsletterSection: React.FC = () => {
  const { customer, updateNewsletter } = useAccount();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Call API route
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        trackEvent("newsletter_signup", { email });

        // If logged in, also sync account newsletter state
        if (customer) {
          updateNewsletter(true).catch(() => {});
        }
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Unable to subscribe at this time.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <section className="py-20 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container max-w-2xl text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Stay Connected
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#141416]">
          A Little More Self-Care, Delivered
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-lg mx-auto leading-relaxed">
          Get product updates, beauty inspiration, and special offers from Cosmelia directly to your inbox.
        </p>

        {status === "success" ? (
          <div className="p-4 bg-[#EBF1ED] border border-[#D0DFD6] rounded-sm text-[#2D5A43] text-xs font-medium animate-fadeIn">
            ✓ Thank you for subscribing! You will receive our latest beauty and self-care updates.
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
              Subscribe
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="text-[11px] text-red-600">{errorMessage || "Please enter a valid email address."}</p>
        )}

        <p className="text-[10px] text-[#8B92A2] tracking-wide">
          We respect your privacy. No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
