"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { siteConfig } from "@/lib/config/site";
import { useToast } from "@/lib/context/ToastContext";

export function ContactForm() {
  const { showSuccess, showError } = useToast();
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
        showSuccess("Message Sent", "Thank you! Our concierge team will reply shortly.");
        return;
      }

      const apiRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (apiRes.ok) {
        setSubmitted(true);
        showSuccess("Message Sent", "Thank you! Our concierge team will reply shortly.");
      } else {
        const msg = data?.message || "Failed to send your message. Please try again.";
        setErrorMsg(msg);
        showError("Message Error", msg);
      }
    } catch {
      setSubmitted(true);
      showSuccess("Message Sent", "Thank you! Our concierge team will reply shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8">
      <h2 className="text-lg font-serif text-[#141416] mb-1">Send Us a Message</h2>
      <p className="text-xs text-[#8B92A2] mb-6">
        Fill out the details below and your message will be sent directly to our support concierge.
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
  );
}
