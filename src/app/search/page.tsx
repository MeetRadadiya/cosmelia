"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/common/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // graceful empty fallback
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const quickSearches = ["LED Mask", "Microcurrent", "Peptide Elixir", "Cryo Globes", "Patches"];

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Search Catalog" }]} />

        <div className="py-12 max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Clinical Search
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            Locate Your Prescribed Modality
          </h1>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search formulations, wavelengths, clinical devices..."
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
                className="text-xs px-2.5 py-1 bg-white border border-[#EAE8E1] rounded-full text-[#5E6472] hover:border-[#141416] hover:text-[#141416] transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="py-8">
          {query.trim() && !isSearching && results.length === 0 && (
            <div className="text-center py-16 bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-2 max-w-lg mx-auto">
              <p className="text-sm text-[#5E6472]">
                No formulations or instruments found matching &ldquo;{query}&rdquo;.
              </p>
              <p className="text-xs text-[#8B92A2]">
                Try searching for broader keywords such as &ldquo;LED&rdquo;, &ldquo;serum&rdquo;, or &ldquo;microcurrent&rdquo;.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              <p className="text-xs text-[#5E6472]">
                Showing {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
