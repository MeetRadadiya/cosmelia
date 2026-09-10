"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/lib/commerce/types";
import { ProductCard } from "@/components/common/ProductCard";

interface ProductCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSort?: string;
}

export const ProductCatalogClient: React.FC<ProductCatalogClientProps> = ({
  initialProducts,
  categories,
  initialCategory = "",
  initialSort = "featured",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(
    initialCategory || searchParams.get("category") || "",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>(
    initialSort || "featured",
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected category if URL searchParam changes
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setSelectedCategorySlug(cat);
  }, [searchParams]);

  // Filtered Categories based on search query inside dropdown
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categories;
    const q = categorySearchQuery.toLowerCase().trim();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearchQuery]);

  // Get active category name
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.slug === selectedCategorySlug);
  }, [categories, selectedCategorySlug]);

  // Handle Category Selection
  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setIsCategoryDropdownOpen(false);
    setCategorySearchQuery("");

    // Sync URL parameter without full page reload
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  // Filter & Sort Products (Client-Side for instant live responsiveness)
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Category Filter
    if (selectedCategorySlug) {
      const slugLower = selectedCategorySlug.toLowerCase();
      list = list.filter((p) => {
        return (
          p.categorySlug?.toLowerCase() === slugLower ||
          p.categoryId === selectedCategorySlug ||
          p.category?.toLowerCase().replace(/\s+/g, "-") === slugLower ||
          p.category?.toLowerCase().includes(slugLower.replace(/-/g, " "))
        );
      });
    }

    // 2. Text Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const catMatch = (p.category || "").toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch;
      });
    }

    // 3. Price Range Filter
    if (priceRange !== "all") {
      list = list.filter((p) => {
        const price = p.price;
        if (priceRange === "under-25") return price < 25;
        if (priceRange === "25-50") return price >= 25 && price <= 50;
        if (priceRange === "over-50") return price > 50;
        return true;
      });
    }

    // 4. In-Stock Only Filter
    if (inStockOnly) {
      list = list.filter(
        (p) => p.available ?? p.stockStatus !== "out_of_stock",
      );
    }

    // 5. Sorting
    list.sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      return 0; // Default featured order
    });

    return list;
  }, [
    initialProducts,
    selectedCategorySlug,
    searchQuery,
    priceRange,
    inStockOnly,
    sortOption,
  ]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategorySlug("");
    setSearchQuery("");
    setCategorySearchQuery("");
    setPriceRange("all");
    setSortOption("featured");
    setInStockOnly(false);
    router.replace("/products", { scroll: false });
  };

  const hasActiveFilters =
    Boolean(selectedCategorySlug) ||
    Boolean(searchQuery.trim()) ||
    priceRange !== "all" ||
    inStockOnly ||
    sortOption !== "featured";

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#EAE8E1] rounded-sm p-4 shadow-xs space-y-4">
        {/* Top Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* 1. Live Product Search Field */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or tool..."
              className="w-full bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm py-2 pl-9 pr-8 text-xs text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#8C734B] transition-colors"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B92A2]"
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
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B92A2] hover:text-[#141416] text-xs font-bold p-1 cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Filter Dropdowns Group */}
          <div className="hidden md:flex flex-wrap items-center gap-3">
            {/* 2. SEARCHABLE Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className={`px-3 py-2 bg-[#FAF9F6] border rounded-sm text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategorySlug
                    ? "border-[#8C734B] text-[#8C734B] font-semibold bg-[#F4EEE5]/50"
                    : "border-[#EAE8E1] text-[#141416] hover:border-[#8C734B]"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 text-[#8C734B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span className="truncate max-w-[140px]">
                  {activeCategoryObj ? activeCategoryObj.name : "Category: All"}
                </span>
                <svg
                  className={`w-3 h-3 text-[#8B92A2] transition-transform duration-200 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
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

              {/* Category Dropdown Menu with Search Input */}
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white border border-[#EAE8E1] rounded-sm shadow-xl z-50 p-2 animate-fadeIn space-y-2">
                  {/* Category Search Input Inside Dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder="Search category..."
                      className="w-full bg-[#FAF9F6] border border-[#EAE8E1] rounded-xs py-1.5 pl-7 pr-3 text-xs text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#8C734B]"
                      autoFocus
                    />
                    <svg
                      className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-[#8B92A2]"
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
                  </div>

                  {/* Category List */}
                  <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                    <button
                      type="button"
                      onClick={() => handleSelectCategory("")}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                        !selectedCategorySlug
                          ? "bg-[#141416] text-white font-semibold"
                          : "text-[#5E6472] hover:bg-[#FAF9F6] hover:text-[#141416]"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-[10px] opacity-70">
                        ({initialProducts.length})
                      </span>
                    </button>

                    {filteredCategories.map((c) => {
                      const isSelected = selectedCategorySlug === c.slug;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectCategory(c.slug)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-[#8C734B] text-white font-semibold"
                              : "text-[#5E6472] hover:bg-[#FAF9F6] hover:text-[#141416]"
                          }`}
                        >
                          <span className="truncate pr-2">{c.name}</span>
                          {isSelected && <span className="text-xs">✓</span>}
                        </button>
                      );
                    })}

                    {filteredCategories.length === 0 && (
                      <div className="px-2.5 py-3 text-center text-xs text-[#8B92A2]">
                        No matching category
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Price Filter Dropdown */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs font-medium text-[#141416] focus:outline-none focus:border-[#8C734B] cursor-pointer"
            >
              <option value="all">Price: All</option>
              <option value="under-25">Under $25</option>
              <option value="25-50">$25 to $50</option>
              <option value="over-50">Over $50</option>
            </select>

            {/* 4. Sort By Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs font-medium text-[#141416] focus:outline-none focus:border-[#8C734B] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>

            {/* 5. In-Stock Only Checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-[#5E6472] cursor-pointer selection:bg-transparent">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-xs text-[#141416] cursor-pointer"
              />
              <span>In Stock</span>
            </label>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="flex md:hidden items-center justify-between gap-2 pt-2 border-t border-[#EAE8E1]">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex-1 py-2 px-3 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs font-semibold text-[#141416] flex items-center justify-center gap-2 cursor-pointer"
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>
                {mobileFiltersOpen ? "Hide Filters" : "Filter & Sort Products"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Expanded Filters Panel */}
        {mobileFiltersOpen && (
          <div className="md:hidden pt-3 space-y-3 border-t border-[#EAE8E1] animate-fadeIn">
            {/* Mobile Searchable Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C734B]">
                Category
              </label>
              <select
                value={selectedCategorySlug}
                onChange={(e) => handleSelectCategory(e.target.value)}
                className="w-full p-2 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs text-[#141416]"
              >
                <option value="">
                  All Categories ({initialProducts.length})
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Mobile Price */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C734B]">
                  Price
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs text-[#141416]"
                >
                  <option value="all">All Prices</option>
                  <option value="under-25">Under $25</option>
                  <option value="25-50">$25 to $50</option>
                  <option value="over-50">Over $50</option>
                </select>
              </div>

              {/* Mobile Sort */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C734B]">
                  Sort By
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs text-[#141416]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Mobile Checkbox */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#5E6472]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#8C734B] underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Badges & Results Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE8E1]/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8B92A2] font-medium">Active:</span>

            {selectedCategorySlug && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F4EEE5] text-[#825E36] rounded-full text-[11px] font-medium border border-[#E8D5C4]">
                Category:{" "}
                {activeCategoryObj
                  ? activeCategoryObj.name
                  : selectedCategorySlug}
                <button
                  type="button"
                  onClick={() => handleSelectCategory("")}
                  className="hover:text-[#141416] ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F4EEE5] text-[#825E36] rounded-full text-[11px] font-medium border border-[#E8D5C4]">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-[#141416] ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {priceRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F4EEE5] text-[#825E36] rounded-full text-[11px] font-medium border border-[#E8D5C4]">
                Price: {priceRange}
                <button
                  type="button"
                  onClick={() => setPriceRange("all")}
                  className="hover:text-[#141416] ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F4EEE5] text-[#825E36] rounded-full text-[11px] font-medium border border-[#E8D5C4]">
                In Stock Only
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-[#141416] ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {!hasActiveFilters && (
              <span className="text-xs text-[#5E6472]">
                Showing all products
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-bold ml-2 cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="text-xs text-[#5E6472] font-medium whitespace-nowrap">
            Showing{" "}
            <strong className="text-[#141416]">
              {filteredProducts.length}
            </strong>{" "}
            of {initialProducts.length} products
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#EAE8E1] flex items-center justify-center mx-auto text-[#8C734B] text-xl">
              🔍
            </div>
            <h3 className="text-lg font-serif text-[#141416]">
              No matching products found
            </h3>
            <p className="text-xs text-[#5E6472] max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any beauty tools matching your search
              criteria. Try adjusting your search keyword or resetting filters.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-block px-4 py-2 bg-[#141416] text-[#FAF9F6] text-xs font-semibold rounded-xs uppercase tracking-wider hover:bg-[#8C734B] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
