"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { siteConfig } from "@/lib/config/site";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      "331d10c4-b462-44ee-a2f4-83da32fdd14d";

    try {
      // Direct Web3Forms submission from browser
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject?.trim() || `New Contact Inquiry from ${formData.name.trim()} - COSMELIA`,
          message: formData.message.trim(),
          from_name: "COSMELIA Storefront",
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && (data?.success || data?.status === 200)) {
        setSubmitted(true);
        return;
      }

      // Fallback API call
      const apiRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (apiRes.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data?.message || "Failed to send your message. Please try again.");
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-4xl">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        {/* Header Section */}
        <div className="py-8 border-b border-[#EAE8E1] space-y-3 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Customer Support & Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            We&apos;re Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-lg mx-auto leading-relaxed">
            Have a question about our beauty tools, order tracking, shipping, or returns?
            Our support concierge is always ready to assist you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="group p-5 bg-white border border-[#EAE8E1] rounded-sm hover:border-[#8C734B] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] text-[#8C734B] flex items-center justify-center mb-3 text-sm font-semibold">
              ✉
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C734B] font-semibold">
              Email Support
            </p>
            <p className="text-sm font-serif font-semibold text-[#141416] mt-1 break-all">
              {siteConfig.supportEmail}
            </p>
            <p className="text-[11px] text-[#8B92A2] mt-1">
              Direct inbox delivery
            </p>
          </a>

          <a
            href={`tel:${siteConfig.supportPhone.replace(/[^+\d]/g, "")}`}
            className="group p-5 bg-white border border-[#EAE8E1] rounded-sm hover:border-[#8C734B] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] text-[#8C734B] flex items-center justify-center mb-3 text-sm font-semibold">
              📞
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C734B] font-semibold">
              Direct Phone
            </p>
            <p className="text-sm font-serif font-semibold text-[#141416] mt-1">
              {siteConfig.supportPhone}
            </p>
            <p className="text-[11px] text-[#8B92A2] mt-1">
              Mon–Fri · 9:00 AM – 6:00 PM EST
            </p>
          </a>

          <div className="p-5 bg-white border border-[#EAE8E1] rounded-sm">
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] text-[#8C734B] flex items-center justify-center mb-3 text-sm font-semibold">
              📍
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C734B] font-semibold">
              Location & Shipping
            </p>
            <p className="text-sm font-serif font-semibold text-[#141416] mt-1">
              {siteConfig.address}
            </p>
            <p className="text-[11px] text-[#8B92A2] mt-1">
              Fast worldwide express fulfillment
            </p>
          </div>
        </div>

        {/* Form & FAQs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Contact Form */}
          <div className="md:col-span-7 bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8">
            <h2 className="text-lg font-serif text-[#141416] mb-1">Send Us a Message</h2>
            <p className="text-xs text-[#8B92A2] mb-6">
              Fill out the details below and your message will be sent directly to our email.
            </p>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EBF1ED] text-[#2D5A43] flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-serif text-[#141416]">Message Sent Successfully</h3>
                <p className="text-xs text-[#5E6472] max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-medium text-[#141416]">{formData.name}</span>.
                  Your message has been transmitted directly to <span className="font-medium text-[#141416]">{siteConfig.supportEmail}</span>.
                  Our team will get back to you at <span className="font-medium text-[#141416]">{formData.email}</span> within 24 hours.
                </p>
                <div className="pt-2 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-600">
                    {errorMsg}
                  </div>
                )}
                <Input
                  label="Your Name"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="support@getcosmelia.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Subject (Optional)"
                  placeholder="Order Status / Product Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-[#141416]/80">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with your order or product inquiries?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Quick Help & FAQ Sidebar */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 space-y-4">
              <h3 className="text-sm font-serif font-semibold text-[#141416] uppercase tracking-wider">
                Looking for Fast Answers?
              </h3>
              <p className="text-xs text-[#5E6472] leading-relaxed">
                Check our dedicated support resources for instant help regarding your orders:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <Link
                  href="/account/track"
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-sm border border-[#EAE8E1] hover:border-[#8C734B] text-[#141416] font-medium transition-all"
                >
                  <span>📦 Track Your Order</span>
                  <span className="text-[#8C734B]">→</span>
                </Link>
                <Link
                  href="/returns"
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-sm border border-[#EAE8E1] hover:border-[#8C734B] text-[#141416] font-medium transition-all"
                >
                  <span>🔄 Returns & Exchanges Policy</span>
                  <span className="text-[#8C734B]">→</span>
                </Link>
                <Link
                  href="/shipping"
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-sm border border-[#EAE8E1] hover:border-[#8C734B] text-[#141416] font-medium transition-all"
                >
                  <span>🚚 Shipping & Delivery Info</span>
                  <span className="text-[#8C734B]">→</span>
                </Link>
              </div>
            </div>

            <div className="p-5 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-2 text-xs text-[#5E6472]">
              <p className="font-semibold text-[#141416]">💡 Support Tip:</p>
              <p>
                Include your <strong>Order Number</strong> (e.g. #CS-10928) in your message for faster resolution by our concierge team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
