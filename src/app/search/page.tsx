"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/common/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

function SearchFormContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || searchParams?.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // graceful empty fallback
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const quickSearches = ["Pimple", "Patch", "Eye", "Roller", "LED", "Beauty"];

  return (
    <div className="space-y-8">
      <div className="py-8 max-w-2xl mx-auto text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Product Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
          Find Your Beauty & Self-Care Essentials
        </h1>

        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beauty tools, facial rollers, patches, masks..."
            className="w-full px-6 py-4 text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] shadow-sm"
            autoFocus
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8B92A2]">
              Searching...
            </div>
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-[11px] text-[#8B92A2] uppercase tracking-wider">Suggested:</span>
          {quickSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                query.toLowerCase() === term.toLowerCase()
                  ? "bg-[#141416] text-white border-[#141416]"
                  : "bg-white border-[#EAE8E1] text-[#5E6472] hover:border-[#141416] hover:text-[#141416]"
              }`}
            >
              {term}
            </button>
          ))}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs px-2.5 py-1 bg-[#FAF9F6] border border-[#EAE8E1] rounded-full text-[#8C734B] font-semibold hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="py-4">
        {isSearching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-2 max-w-lg mx-auto">
            <p className="text-sm text-[#5E6472]">
              No products found matching &ldquo;{query}&rdquo;.
            </p>
            <p className="text-xs text-[#8B92A2]">
              Try searching for broader keywords such as &ldquo;Patch&rdquo;, &ldquo;Eye&rdquo;, or &ldquo;Roller&rdquo;.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5E6472]">
                {query.trim()
                  ? `Showing ${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
                  : `Showing all ${results.length} products`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Search Catalog" }]} />
        <Suspense fallback={<div className="h-48 bg-white animate-pulse rounded-sm my-8" />}>
          <SearchFormContent />
        </Suspense>
      </div>
    </div>
  );
}
