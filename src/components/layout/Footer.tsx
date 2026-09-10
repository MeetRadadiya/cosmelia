"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "../../lib/config/site";
import { navigationConfig } from "@/lib/config/navigation";
import { useCategories } from "@/lib/context/CategoryContext";
import { FooterNewsletter } from "./FooterNewsletter";
import { Logo } from "../common/Logo";

export const Footer: React.FC = () => {
  const { categories } = useCategories();

  return (
    <footer className="bg-[#141416] text-[#FAF9F6] border-t border-white/10 pt-16 pb-12">
      <div className="luxury-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Logo asLink href="/" variant="dark" size="lg" />
            <p className="text-xs text-[#8B92A2] max-w-sm leading-relaxed font-light">
              {siteConfig.description}
            </p>
            <div className="pt-1 text-xs text-[#8B92A2]">
              <p>
                Concierge:{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="text-[#FAF9F6] hover:text-[#C5A059] transition-colors"
                >
                  {siteConfig.supportEmail}
                </a>
              </p>
            </div>
            <div className="pt-2">
              <FooterNewsletter />
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-4">
              Modalities
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FAF9F6] transition-colors block py-0.5"
                >
                  All Collections
                </Link>
              </li>
              {categories.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/categories/${item.slug}`}
                    className="hover:text-[#FAF9F6] transition-colors block py-0.5"
                  >
                    {item.displayName || item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              {navigationConfig.footerNav.support.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-[#FAF9F6] transition-colors block py-0.5"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Information */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              {navigationConfig.footerNav.legal.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-[#FAF9F6] transition-colors block py-0.5"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8B92A2]">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <span>Powered by FatherShops Headless Architecture</span>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/disclaimer"
              className="hover:text-white transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              href="/sitemap.xml"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
