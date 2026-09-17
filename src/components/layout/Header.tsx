"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "../../lib/config/site";
import { useCart } from "../../lib/context/CartContext";
import { useCategories } from "../../lib/context/CategoryContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { CartDrawer } from "./CartDrawer";
import { useAccount } from "@/lib/context/AccountContext";
import { useCompare } from "@/lib/context/CompareContext";
import { trackEvent } from "@/lib/analytics";
import { Logo } from "../common/Logo";

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { categories } = useCategories();
  const { customer } = useAccount();
  const { itemCount: compareItemCount } = useCompare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {},
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileSubmenu = (title: string) => {
    setMobileExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackEvent("search", { search_term: searchQuery.trim() });
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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
          <div className="luxury-container h-16 md:h-20 flex items-center justify-between gap-1 sm:gap-4 !px-3 sm:!px-6 md:!px-8">
            {/* Mobile Hamburger Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 -ml-1 text-[#141416] hover:text-[#8C734B] transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center shrink-0">
              <Logo asLink href="/" size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-3 xl:space-x-5 2xl:space-x-7 shrink-0"
              aria-label="Main Navigation"
            >
              {/* All Products */}
              <Link
                href="/products"
                className={`whitespace-nowrap text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-medium transition-colors py-1 ${
                  pathname === "/products"
                    ? "text-[#8C734B] font-semibold"
                    : "text-[#141416] hover:text-[#8C734B]"
                }`}
              >
                All Products
              </Link>

              {/* Dynamic Collections Dropdown */}
              <div
                className="relative group py-6"
                onMouseEnter={() => setActiveDropdown("collections")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/categories"
                  className={`whitespace-nowrap text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-medium transition-colors flex items-center gap-1 xl:gap-1.5 py-1 ${
                    pathname.startsWith("/categories") &&
                    pathname !== `/categories/${categories[0]?.slug}`
                      ? "text-[#8C734B] font-semibold"
                      : "text-[#141416] hover:text-[#8C734B]"
                  }`}
                >
                  <span>Collections</span>
                  <svg
                    className={`w-2.5 h-2.5 xl:w-3 xl:h-3 transition-transform duration-200 ${
                      activeDropdown === "collections"
                        ? "rotate-180 text-[#8C734B]"
                        : "text-[#8B92A2] group-hover:text-[#8C734B]"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>

                {/* Dropdown Menu */}
                {activeDropdown === "collections" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="w-[400px] bg-white border border-[#EAE8E1] shadow-2xl p-5 rounded-sm animate-fadeIn">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-[#EAE8E1]/60">
                          <span className="text-[10px] tracking-widest uppercase text-[#8B92A2] font-bold">
                            Store Modalities
                          </span>
                          <span className="text-[10px] text-[#8C734B] font-semibold">
                            {categories.length} Categories
                          </span>
                        </div>
                        <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/categories/${cat.slug}`}
                              className="block p-2 rounded-sm hover:bg-[#FAF9F6] transition-colors group/sub"
                            >
                              <div className="text-xs font-semibold text-[#141416] group-hover/sub:text-[#8C734B] transition-colors flex items-center justify-between">
                                <span>{cat.displayName || cat.name}</span>
                                <span className="text-[10px] opacity-0 group-hover/sub:opacity-100 transition-opacity text-[#8C734B]">
                                  &rarr;
                                </span>
                              </div>
                              {cat.description && (
                                <div className="text-[11px] text-[#5E6472] font-light mt-0.5 line-clamp-1">
                                  {cat.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-[#EAE8E1]/60">
                          <Link
                            href="/categories"
                            className="text-[10px] uppercase font-bold tracking-wider text-[#8C734B] hover:underline inline-flex items-center gap-1"
                          >
                            Explore All Categories &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link
                href="/about"
                className={`whitespace-nowrap text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-medium transition-colors py-1 ${
                  pathname === "/about"
                    ? "text-[#8C734B] font-semibold"
                    : "text-[#141416] hover:text-[#8C734B]"
                }`}
              >
                About Us
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className={`whitespace-nowrap text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-medium transition-colors py-1 ${
                  pathname === "/faq"
                    ? "text-[#8C734B] font-semibold"
                    : "text-[#141416] hover:text-[#8C734B]"
                }`}
              >
                FAQ
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`whitespace-nowrap text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-medium transition-colors py-1 ${
                  pathname === "/contact"
                    ? "text-[#8C734B] font-semibold"
                    : "text-[#141416] hover:text-[#8C734B]"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-0.5 sm:space-x-2 xl:space-x-3.5 shrink-0">
              {/* Direct Search Link */}
              <Link
                href="/search"
                className="p-1.5 sm:p-2 text-[#141416] hover:text-[#8C734B] transition-colors cursor-pointer"
                aria-label="Search catalog"
              >
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>

              {/* Product Compare Link */}
              <Link
                href="/compare"
                className="relative p-1.5 sm:p-2 text-[#141416] hover:text-[#8C734B] transition-colors cursor-pointer"
                aria-label="Compare products"
                title="Product Comparison"
              >
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {compareItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#8C734B] text-[#FAF9F6] text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                    {compareItemCount}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-1.5 sm:p-2 text-[#141416] hover:text-[#8C734B] transition-colors"
                aria-label="Customer Account"
              >
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
                className="relative p-1.5 sm:p-2 text-[#141416] hover:text-[#8C734B] transition-colors cursor-pointer"
                aria-label="Open cart bag"
              >
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cart && cart.itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#141416] text-[#FAF9F6] text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
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

      {/* Mobile Navigation Drawer with Smooth Slide Animation */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0 delay-200"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop Overlay with Smooth Fade */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel with Smooth Slide from Left */}
        <div
          className={`fixed inset-y-0 left-0 w-[85%] max-w-[340px] sm:max-w-sm bg-[#FAF9F6] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-6">
            {/* Header inside mobile drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE8E1]">
              <Logo
                asLink
                href="/"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#141416] hover:text-[#8C734B]"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-white border border-[#EAE8E1] rounded-sm py-2 pl-3 pr-10 text-xs text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#8C734B]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8B92A2] hover:text-[#8C734B]"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs uppercase tracking-wider font-medium border-b border-[#EAE8E1]/50 ${
                  pathname === "/products"
                    ? "text-[#8C734B] font-bold"
                    : "text-[#141416]"
                }`}
              >
                <span>All Products</span>
              </Link>

              {/* Mobile Collections Accordion */}
              <div className="border-b border-[#EAE8E1]/50 py-1">
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase tracking-wider font-medium text-[#141416]"
                  >
                    Collections
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu("collections")}
                    className="p-1.5 text-[#8B92A2] hover:text-[#141416]"
                    aria-label="Toggle collections"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileExpanded["collections"] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {mobileExpanded["collections"] && (
                  <div className="pl-3 pb-3 space-y-2 border-l border-[#8C734B]/30 my-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-xs text-[#5E6472] hover:text-[#8C734B] transition-colors"
                      >
                        {cat.displayName || cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Link to Hero Category */}
              {categories.length > 0 && (
                <Link
                  href={`/categories/${categories[0].slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 text-xs uppercase tracking-wider font-medium border-b border-[#EAE8E1]/50 ${
                    pathname === `/categories/${categories[0].slug}`
                      ? "text-[#8C734B] font-bold"
                      : "text-[#141416]"
                  }`}
                >
                  <span>{categories[0].displayName || categories[0].name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#F4EEE5] text-[#825E36] font-semibold rounded-[2px]">
                    Bestseller
                  </span>
                </Link>
              )}

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs uppercase tracking-wider font-medium border-b border-[#EAE8E1]/50 ${
                  pathname === "/about"
                    ? "text-[#8C734B] font-bold"
                    : "text-[#141416]"
                }`}
              >
                <span>About Us</span>
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs uppercase tracking-wider font-medium border-b border-[#EAE8E1]/50 ${
                  pathname === "/faq"
                    ? "text-[#8C734B] font-bold"
                    : "text-[#141416]"
                }`}
              >
                <span>FAQ</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs uppercase tracking-wider font-medium border-b border-[#EAE8E1]/50 ${
                  pathname === "/contact"
                    ? "text-[#8C734B] font-bold"
                    : "text-[#141416]"
                }`}
              >
                <span>Contact</span>
              </Link>
            </div>
          </div>

          {/* Bottom Drawer Support & Account */}
          <div className="pt-6 border-t border-[#EAE8E1] space-y-3">
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs uppercase tracking-wider font-medium text-[#141416] hover:text-[#8C734B]"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#8C734B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Product Comparison</span>
              </span>
              {compareItemCount > 0 ? (
                <span className="text-[9px] px-1.5 py-0.2 bg-[#8C734B] text-white font-bold rounded-full">
                  {compareItemCount}
                </span>
              ) : (
                <span className="text-[#8B92A2]">&rarr;</span>
              )}
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs uppercase tracking-wider font-medium text-[#141416] hover:text-[#8C734B]"
            >
              <span>My Account</span>
              <span className="text-[#8B92A2]">&rarr;</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs uppercase tracking-wider text-[#5E6472] hover:text-[#8C734B]"
            >
              <span>Contact Concierge</span>
              <span className="text-[#8B92A2]">&rarr;</span>
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs uppercase tracking-wider text-[#5E6472] hover:text-[#8C734B]"
            >
              <span>Frequently Asked Questions</span>
              <span className="text-[#8B92A2]">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
