import React from "react";
import Link from "next/link";
import { siteConfig } from "../../lib/config/site";
import { navigationConfig } from "../../lib/config/navigation";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141416] text-[#FAF9F6] border-t border-white/10 pt-16 pb-12 mt-20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif tracking-[0.25em] font-semibold text-[#FAF9F6] uppercase">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-[#8B92A2] max-w-sm leading-relaxed font-light">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-[#FAF9F6]/80 space-y-1">
              <p>Concierge: {siteConfig.supportEmail}</p>
              <p>Toll-Free: {siteConfig.supportPhone}</p>
              <p>{siteConfig.address}</p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Modalities
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              {navigationConfig.footerNav.shop.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-[#FAF9F6] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Clinical Science
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              {navigationConfig.footerNav.technology.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-[#FAF9F6] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B92A2]">
              {navigationConfig.footerNav.support.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-[#FAF9F6] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              {navigationConfig.footerNav.legal.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-[#FAF9F6] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#8B92A2]">
          <p>© {new Date().getFullYear()} {siteConfig.name} Beverly Hills. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Powered by FatherShops Headless Architecture</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
