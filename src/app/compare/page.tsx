"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/lib/context/CompareContext";
import { useCart } from "@/lib/context/CartContext";
import { useLocale } from "@/lib/context/LocaleContext";
import {
  getProductReviews,
  REVIEWS_UPDATED_EVENT,
  ReviewsUpdateEventDetail,
} from "@/lib/reviews/reviewStore";

export default function ComparePage() {
  const { items, itemCount, removeFromCompare, clearCompare } = useCompare();
  const { addItem, openCart } = useCart();
  const { formatCurrencyAmount } = useLocale();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Live review ratings & count mapping for compared products
  const [reviewSummaries, setReviewSummaries] = useState<
    Record<string, { rating: number; reviewCount: number }>
  >(() => {
    const initial: Record<string, { rating: number; reviewCount: number }> = {};
    items.forEach((p) => {
      const { summary } = getProductReviews(p);
      initial[p.id] = {
        rating: summary.totalReviews > 0 ? summary.averageRating : (p.rating || 5),
        reviewCount: summary.totalReviews || p.reviewCount || 0,
      };
    });
    return initial;
  });

  // Sync and fetch live reviews from server
  useEffect(() => {
    items.forEach((p) => {
      // 1. Initial check with local reviewStore
      const { summary } = getProductReviews(p);
      if (summary.totalReviews > 0) {
        setReviewSummaries((prev) => ({
          ...prev,
          [p.id]: {
            rating: summary.averageRating,
            reviewCount: summary.totalReviews,
          },
        }));
      }

      // 2. Fetch fresh rating & review count from server API
      fetch(`/api/products/${encodeURIComponent(p.id)}/reviews`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.summary && data.summary.totalReviews > 0) {
            setReviewSummaries((prev) => ({
              ...prev,
              [p.id]: {
                rating: data.summary.averageRating,
                reviewCount: data.summary.totalReviews,
              },
            }));
          }
        })
        .catch(() => {});
    });

    const handleReviewsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ReviewsUpdateEventDetail>;
      if (customEvent.detail) {
        setReviewSummaries((prev) => ({
          ...prev,
          [customEvent.detail.productId]: {
            rating: customEvent.detail.averageRating,
            reviewCount: customEvent.detail.totalReviews,
          },
        }));
      }
    };

    window.addEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    };
  }, [items]);

  const handleAddToCart = async (product: any) => {
    setAddingId(product.id);
    try {
      await addItem(product, 1);
      openCart();
    } catch (e) {
      console.error("Add to cart error:", e);
    } finally {
      setAddingId(null);
    }
  };

  // Collect all unique specification keys across all compared products
  const allSpecKeys = React.useMemo(() => {
    const keysSet = new Set<string>();
    items.forEach((p) => {
      if (p.specifications && typeof p.specifications === "object") {
        Object.keys(p.specifications).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [items]);

  if (itemCount === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EAE8E1]/40 border border-[#8C734B]/30 flex items-center justify-center mx-auto text-[#8C734B]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Side-by-Side Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#141416]">Your Comparison List is Empty</h1>
            <p className="text-xs sm:text-sm text-[#5E6472] leading-relaxed">
              Explore our collection of skincare devices and beauty accessories. Select &ldquo;Compare&rdquo; on any
              item to view specifications, features, and pricing side-by-side.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#141416] hover:bg-[#252528] text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest rounded-xs transition-colors shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#5E6472]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#141416] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#141416] font-medium">Product Comparison</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE8E1] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">Product Matrix</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#141416] mt-1">Compare Products</h1>
          <p className="text-xs sm:text-sm text-[#5E6472] mt-1">
            Comparing <strong className="text-[#141416]">{itemCount}</strong> of 4 items side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="text-xs font-medium text-[#8C734B] hover:text-[#141416] underline transition-colors"
          >
            + Add more products
          </Link>
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-sm border border-[#EAE8E1] bg-white shadow-xs">
        <table
          className="w-full table-fixed text-left border-collapse"
          style={{ minWidth: `${Math.max(760, 170 + items.length * 260)}px` }}
        >
          <colgroup>
            <col style={{ width: "170px" }} />
            {items.map((prod) => (
              <col key={prod.id} style={{ width: `${100 / items.length}%` }} />
            ))}
          </colgroup>
          <thead>
            {/* Top Product Header Row */}
            <tr className="border-b border-[#EAE8E1]">
              <th className="p-4 sm:p-6 bg-[#FAF9F6] align-top text-xs uppercase tracking-wider font-semibold text-[#8C734B] border-r border-[#EAE8E1] overflow-hidden break-words">
                Product
              </th>
              {items.map((prod) => (
                <th
                  key={prod.id}
                  className="p-4 sm:p-6 align-top border-r last:border-r-0 border-[#EAE8E1] relative overflow-hidden break-words"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCompare(prod.id)}
                    className="absolute top-3 right-3 text-[#8B92A2] hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    title={`Remove ${prod.name}`}
                    aria-label={`Remove ${prod.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-xs overflow-hidden bg-[#FAF9F6] border border-[#EAE8E1]">
                      {prod.thumbnail || prod.images?.[0] ? (
                        <Image
                          src={prod.thumbnail || prod.images[0]}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 220px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Name & Link */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-[#8C734B]">
                        {prod.category}
                      </span>
                      <h2 className="text-sm font-medium text-[#141416] line-clamp-2 hover:text-[#8C734B] transition-colors leading-snug">
                        <Link href={`/product/${prod.slug}`}>{prod.name}</Link>
                      </h2>
                    </div>

                    {/* Quick Add To Cart Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      disabled={addingId === prod.id}
                      className="w-full py-2.5 px-3 bg-[#141416] hover:bg-[#252528] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {addingId === prod.id ? (
                        <span>Adding...</span>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAE8E1] text-xs sm:text-sm">
            {/* Price Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Price
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] overflow-hidden break-words">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-base text-[#141416]">{formatCurrencyAmount(prod.price)}</span>
                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <span className="text-xs text-[#8B92A2] line-through">
                        {formatCurrencyAmount(prod.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Availability Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Availability
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] overflow-hidden break-words">
                  {prod.stockStatus === "in_stock" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                      In Stock • Ready to Ship
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B83A3A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B83A3A]"></span>
                      Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Rating & Reviews
              </td>
              {items.map((prod) => {
                const rev = reviewSummaries[prod.id] || {
                  rating: prod.rating || 5,
                  reviewCount: prod.reviewCount || 0,
                };
                return (
                  <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] overflow-hidden break-words">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex text-[#8C734B] text-xs tracking-tight">
                        {"★".repeat(Math.round(rev.rating || 5))}
                        {"☆".repeat(5 - Math.round(rev.rating || 5))}
                      </div>
                      <span className="text-xs text-[#5E6472]">
                        {rev.reviewCount > 0 ? (
                          <>
                            <strong className="text-[#141416] font-semibold">{rev.rating.toFixed(1)}</strong>{" "}
                            ({rev.reviewCount} {rev.reviewCount === 1 ? "review" : "reviews"})
                          </>
                        ) : (
                          "(0 reviews)"
                        )}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Model / SKU Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Model / SKU
              </td>
              {items.map((prod) => (
                <td
                  key={prod.id}
                  className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] text-xs font-mono text-[#5E6472] overflow-hidden break-words"
                >
                  {prod.sku || prod.id}
                </td>
              ))}
            </tr>

            {/* Brand / Category Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Collection
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] text-[#5E6472] overflow-hidden break-words">
                  {prod.category || "Cosmelia Care"}
                </td>
              ))}
            </tr>

            {/* Dynamic Specifications Rows */}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] capitalize overflow-hidden break-words">
                  {key}
                </td>
                {items.map((prod) => {
                  const val = prod.specifications?.[key];
                  return (
                    <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] text-[#5E6472] overflow-hidden break-words">
                      {val || "—"}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Summary Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Summary
              </td>
              {items.map((prod) => {
                const cleanSummary = (prod.description || "")
                  .replace(/<[^>]*>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 180);
                return (
                  <td
                    key={prod.id}
                    className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] text-xs text-[#5E6472] leading-relaxed overflow-hidden break-words"
                  >
                    {cleanSummary ? `${cleanSummary}...` : "—"}
                  </td>
                );
              })}
            </tr>

            {/* Bottom Actions Row */}
            <tr>
              <td className="p-4 sm:p-5 bg-[#FAF9F6] font-medium text-[#141416] border-r border-[#EAE8E1] overflow-hidden break-words">
                Actions
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 sm:p-5 border-r last:border-r-0 border-[#EAE8E1] overflow-hidden break-words">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      disabled={addingId === prod.id}
                      className="w-full py-2.5 px-3 bg-[#141416] hover:bg-[#252528] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {addingId === prod.id ? "Adding..." : "Add to Bag"}
                    </button>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="w-full py-2 text-center text-xs text-[#141416] hover:text-[#8C734B] font-medium border border-[#EAE8E1] rounded-xs hover:border-[#141416] transition-colors"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
