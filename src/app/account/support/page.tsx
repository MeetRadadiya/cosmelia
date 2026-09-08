"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { siteConfig } from "@/lib/config/site";

export default function SupportPage() {
  const { customer } = useAccount();
  const [form, setForm] = useState({
    name: customer ? `${customer.firstName} ${customer.lastName}` : "",
    email: customer?.email || "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (!form.name.trim()) fe.name = "Required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) fe.email = "Enter a valid email.";
    if (!form.subject.trim()) fe.subject = "Required.";
    if (form.message.trim().length < 10) fe.message = "Please provide a few more details.";
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;

    setLoading(true);
    // Frontend form only: instructs user to send an email or call. No server-side ticket endpoint.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 400);
  };

  return (
    <AccountLayout title="Support & Concierge" breadcrumbLabel="Support">
      <div className="space-y-6">
        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Email Us",
              value: siteConfig.supportEmail,
              sub: "Replies within 24 hours",
              href: `mailto:${siteConfig.supportEmail}`,
            },
            {
              title: "Call Concierge",
              value: siteConfig.supportPhone,
              sub: "Mon–Fri · 9am–6pm EST",
              href: `tel:${siteConfig.supportPhone.replace(/[^+\d]/g, "")}`,
            },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group p-5 bg-white border border-[#EAE8E1] rounded-sm hover:border-[#8C734B] transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C734B] font-semibold">{c.title}</p>
              <p className="text-sm font-serif font-semibold text-[#141416] mt-1.5">{c.value}</p>
              <p className="text-[11px] text-[#8B92A2] mt-0.5">{c.sub}</p>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <AccountCard>
          <AccountCardHeader title="Send a Message" />
          <AccountCardBody>
            {sent ? (
              <div className="space-y-4 text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#EBF1ED] flex items-center justify-center text-[#2D5A43] mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-serif text-[#141416]">Message Ready to Send</h3>
                <p className="text-xs text-[#5E6472] max-w-md mx-auto leading-relaxed">
                  Your concierge request has been prepared. To ensure it reaches us instantly, please send it
                  to <span className="font-medium text-[#141416]">{siteConfig.supportEmail}</span> or call our
                  concierge team directly. For order status and returns, visit{" "}
                  <Link href="/account/orders" className="text-[#8C734B] hover:underline font-medium">My Orders</Link>.
                </p>
                <div className="pt-2 flex gap-3 justify-center">
                  <a href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message)}`}>
                    <Button variant="primary" size="md">Open Email Client</Button>
                  </a>
                  <Button variant="ghost" size="md" onClick={() => setSent(false)}>
                    Edit Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    error={fieldErrors.name}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    error={fieldErrors.email}
                  />
                </div>
                <Input
                  label="Subject"
                  required
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  placeholder="e.g. Order status, Returns, Product guidance"
                  error={fieldErrors.subject}
                />
                <div className="w-full flex flex-col gap-1.5">
                  <label htmlFor="support-message" className="text-xs uppercase tracking-wider font-medium text-[#141416]/80">
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us how we can help..."
                    className={`w-full px-4 py-3 text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors duration-200 resize-none ${
                      fieldErrors.message ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-[11px] text-red-600 font-medium">{fieldErrors.message}</p>
                  )}
                </div>
                <Button type="submit" variant="primary" size="md" isLoading={loading}>
                  Prepare Message
                </Button>
              </form>
            )}
          </AccountCardBody>
        </AccountCard>

        {/* FAQs */}
        <AccountCard>
          <AccountCardHeader title="Frequently Asked Questions" />
          <AccountCardBody>
            <div className="divide-y divide-[#EAE8E1]">
              {[
                {
                  q: "Where is my order?",
                  a: "Track your shipment anytime via the Track Shipment page using your tracking number, or visit My Orders for the latest status.",
                },
                {
                  q: "What is your return policy?",
                  a: "Every result is backed by our 60-day clinical guarantee. If you are not satisfied, coverage is available through our returns portal.",
                },
                {
                  q: "Can I change my shipping address?",
                  a: "Contact our concierge immediately after placing your order. Once dispatched, the carrier controls delivery routing.",
                },
                {
                  q: "How do I update my account details?",
                  a: "Head to My Profile under your account dashboard to update your name, email, and phone number at any time.",
                },
              ].map((faq) => (
                <div key={faq.q} className="py-4">
                  <p className="text-sm font-medium text-[#141416]">{faq.q}</p>
                  <p className="text-xs text-[#5E6472] mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </AccountCardBody>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}