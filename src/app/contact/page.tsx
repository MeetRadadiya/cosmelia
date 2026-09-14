import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/lib/config/site";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Customer Support & Concierge",
  description:
    "Get in touch with Cosmelia customer support concierge. Email radadiyameet366@gmail.com or send a direct message for order tracking, shipping, and product help.",
  alternates: {
    canonical: "https://getcosmelia.com/contact",
  },
  openGraph: {
    title: "Contact Us | Cosmelia Customer Support",
    description:
      "Get in touch with Cosmelia customer support concierge for order tracking, shipping, and product help.",
    url: "https://getcosmelia.com/contact",
    siteName: "Cosmelia",
    type: "website",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us | Cosmelia",
  url: "https://getcosmelia.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Cosmelia",
    email: siteConfig.supportEmail,
    telephone: siteConfig.supportPhone,
    url: "https://getcosmelia.com",
  },
};

export default function ContactPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
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
          <div className="md:col-span-7">
            <ContactForm />
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
