"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../../lib/config/site";
import { navigationConfig } from "../../lib/config/navigation";
import { useCart } from "../../lib/context/CartContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { CartDrawer } from "./CartDrawer";

import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const router = useRouter();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <AnnouncementBar />

        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EAE8E1]"
              : "bg-[#FAF9F6] border-b border-[#EAE8E1]/80"
          }`}
        >
          <div className="luxury-container h-16 md:h-20 flex items-center justify-between">
            {/* Mobile Hamburger */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#141416] hover:text-[#8C734B] transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/search" className="p-2 text-[#141416] hover:text-[#8C734B]" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex flex-col items-center group">
                <span className="text-xl md:text-2xl font-serif tracking-[0.25em] font-semibold text-[#141416] uppercase group-hover:text-[#8C734B] transition-colors">
                  {siteConfig.name}
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#8B92A2] font-medium -mt-0.5">
                  Est. Beverly Hills
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationConfig.mainNav.map((item) => {
                const hasSub = (item.children && item.children.length > 0) || item.featuredItem;
                return (
                  <div
                    key={item.title}
                    className="relative group py-6"
                    onMouseEnter={() => hasSub && setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="text-xs uppercase tracking-[0.18em] font-medium text-[#141416] hover:text-[#8C734B] transition-colors flex items-center gap-1.5"
                    >
                      {item.title}
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#F4EEE5] text-[#825E36] font-semibold rounded-[2px]">
                          {item.badge}
                        </span>
                      )}
                      {hasSub && (
                        <svg
                          className="w-3 h-3 text-[#8B92A2] group-hover:text-[#8C734B]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Mega Menu / Dropdown */}
                    {hasSub && activeDropdown === item.title && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white border border-[#EAE8E1] shadow-2xl p-6 rounded-sm animate-fadeIn z-50">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <span className="text-[10px] tracking-widest uppercase text-[#8B92A2] font-bold block mb-3">
                              Clinical Line
                            </span>
                            <div className="space-y-3">
                              {item.children?.map((sub) => (
                                <Link key={sub.title} href={sub.href} className="block group/item">
                                  <div className="text-xs font-semibold text-[#141416] group-hover/item:text-[#8C734B] transition-colors">
                                    {sub.title}
                                  </div>
                                  {sub.description && (
                                    <div className="text-[11px] text-[#5E6472] font-light mt-0.5 line-clamp-1">
                                      {sub.description}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {item.featuredItem && (
                            <div className="bg-[#FAF9F6] p-3 rounded border border-[#EAE8E1]/60 flex flex-col justify-between">
                              <div className="relative aspect-[4/3] w-full rounded overflow-hidden mb-2">
                                <Image
                                  src={item.featuredItem.image}
                                  alt={item.featuredItem.title}
                                  fill
                                  unoptimized
                                  sizes="240px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-[#141416]">{item.featuredItem.title}</h4>
                                <p className="text-[10px] text-[#5E6472] mt-0.5">{item.featuredItem.subtitle}</p>
                                <Link
                                  href={item.featuredItem.href}
                                  className="mt-2 inline-block text-[10px] uppercase font-bold tracking-wider text-[#8C734B] hover:underline"
                                >
                                  View Protocol &rarr;
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Action Icons */}
            <div className="flex items-center space-x-5">
              <Link
                href="/search"
                className="p-2 text-[#141416] hover:text-[#8C734B] transition-colors"
                aria-label="Search catalog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>

              <Link
                href="/account"
                className="p-2 text-[#141416] hover:text-[#8C734B] transition-colors"
                aria-label="Customer Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 text-[#141416] hover:text-[#8C734B] transition-colors cursor-pointer"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cart && cart.itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#141416] text-[#FAF9F6] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay & Drawer */}
      <CartDrawer />

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FAF9F6] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE8E1]">
                <span className="font-serif tracking-[0.2em] font-semibold text-lg uppercase text-[#141416]">
                  {siteConfig.name}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#141416] hover:text-[#8C734B]"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="py-6 space-y-4">
                {navigationConfig.mainNav.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm uppercase tracking-wider font-medium text-[#141416]"
                    >
                      {item.title}
                    </Link>
                    {item.children && (
                      <div className="pl-4 space-y-2 border-l border-[#EAE8E1]">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs text-[#5E6472]"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE8E1] space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-wider text-[#141416]"
              >
                My Account
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-wider text-[#5E6472]"
              >
                Concierge Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
