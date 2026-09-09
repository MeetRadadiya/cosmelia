"use client";

import React, { useState, useRef, useEffect } from "react";
import { siteConfig } from "../../lib/config/site";
import { useLocale } from "../../lib/context/LocaleContext";
import Link from "next/link";

export const AnnouncementBar: React.FC = () => {
  const {
    currencies,
    currentCurrency,
    setCurrency,
  } = useLocale();

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!siteConfig.announcement.enabled) return null;

  return (
    <div className="bg-[#141416] text-[#FAF9F6] text-[10px] sm:text-[11px] font-medium tracking-wider sm:tracking-widest py-1.5 px-3 sm:px-6 border-b border-white/5 uppercase w-full relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left spacer for balance on desktop */}
        <div className="hidden md:flex items-center gap-2 text-[9px] text-white/50 tracking-widest lowercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] inline-block animate-pulse" />
          <span>live store synchronized</span>
        </div>

        {/* Center: Announcement text / link */}
        <div className="flex-1 text-center truncate">
          {siteConfig.announcement.link ? (
            <Link
              href={siteConfig.announcement.link}
              className="hover:text-[#C5A059] transition-colors inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-full text-center leading-tight"
            >
              <span className="text-center">{siteConfig.announcement.text}</span>
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="text-center leading-tight block">{siteConfig.announcement.text}</span>
          )}
        </div>

        {/* Right: Currency Switcher */}
        <div className="flex items-center gap-3 shrink-0 normal-case tracking-normal">
          <div className="relative" ref={currRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/80 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded-sm hover:bg-white/10"
              title="Change Currency"
            >
              <span className="font-semibold text-[#D4AF37]">{currentCurrency}</span>
              <svg className={`w-2.5 h-2.5 transition-transform ${currencyOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {currencyOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 max-h-56 overflow-y-auto bg-[#1C1C1F] border border-white/15 rounded-sm shadow-xl p-1 z-50 text-left">
                {currencies.length > 0 ? (
                  currencies.map((c) => (
                    <button
                      key={c.currency_id || c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[2px] transition-colors flex items-center justify-between ${
                        c.code.toUpperCase() === currentCurrency.toUpperCase()
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">{c.code}</span>
                      <span className="text-[10px] text-white/50">{c.symbol_left || c.symbol_right || ""}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-2.5 py-1 text-[11px] text-white/50">USD ($)</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
