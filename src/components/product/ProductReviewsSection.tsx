"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, ProductReview } from "@/lib/commerce/types";
import {
  getProductReviews,
  isReviewHelpful,
  toggleReviewHelpful,
  REVIEWS_UPDATED_EVENT,
  ReviewsUpdateEventDetail,
} from "@/lib/reviews/reviewStore";
import { ReviewSummary } from "@/lib/reviews/seedReviews";
import { cleanReviewImageUrl, getReviewFullImageUrl } from "@/lib/reviews/imageUtils";
import { WriteReviewModal } from "./WriteReviewModal";
import { ImageLightboxModal } from "./ImageLightboxModal";

interface ProductReviewsSectionProps {
  product: Product;
  initialReviews?: ProductReview[];
  initialSummary?: ReviewSummary;
  canWrite?: boolean;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  initialReviews,
  initialSummary,
  canWrite = true,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews || []);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<"highest" | "recent" | "lowest">(
    "highest",
  );
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const openLightbox = (imgs: string[], initialIdx: number) => {
    setLightboxImages(imgs);
    setLightboxIndex(initialIdx);
    setIsLightboxOpen(true);
  };
  const [votedHelpfulSet, setVotedHelpfulSet] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  // Initialize and sync reviews from local store and server API
  useEffect(() => {
    setIsMounted(true);
    const local = getProductReviews(product);

    const candidates = [...(local.reviews || []), ...(initialReviews || [])];
    const seenContent = new Set<string>();
    const merged: ProductReview[] = [];

    for (const r of candidates) {
      if (!r || !r.comment) continue;
      const contentKey = `${r.author.toLowerCase().trim()}_${r.comment.toLowerCase().trim()}`;
      if (!seenContent.has(contentKey)) {
        seenContent.add(contentKey);
        merged.push(r);
      }
    }

    setReviews(merged);

    // Sync voted helpful IDs from localStorage
    const voted = new Set<string>();
    merged.forEach((r) => {
      if (isReviewHelpful(r.id)) {
        voted.add(r.id);
      }
    });
    setVotedHelpfulSet(voted);

    // Fetch fresh reviews from server API
    fetch(`/api/products/${encodeURIComponent(product.id)}/reviews`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.enabled === false) {
            setIsSectionEnabled(false);
            return;
          }
          if (
            data.success &&
            Array.isArray(data.reviews) &&
            data.reviews.length > 0
          ) {
            setReviews((prev) => {
              const combined = [...data.reviews, ...prev];
              const seen = new Set<string>();
              const result: ProductReview[] = [];
              for (const r of combined) {
                if (!r || !r.comment) continue;
                const key = `${(r.author || "").toLowerCase().trim()}_${(r.comment || "").toLowerCase().trim()}`;
                if (!seen.has(key)) {
                  seen.add(key);
                  result.push(r);
                }
              }
              return result;
            });

            // Update voted set for new reviews
            setVotedHelpfulSet((prevSet) => {
              const nextSet = new Set(prevSet);
              data.reviews.forEach((r: ProductReview) => {
                if (isReviewHelpful(r.id)) nextSet.add(r.id);
              });
              return nextSet;
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch fresh reviews from API", err);
      });

    const handleReviewsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ReviewsUpdateEventDetail>;
      if (customEvent.detail && customEvent.detail.productId === product.id) {
        const updated = getProductReviews(product);
        setReviews((prev) => {
          const currentContent = new Set<string>();
          const resList: ProductReview[] = [];
          for (const r of [...prev, ...updated.reviews]) {
            if (!r || !r.comment) continue;
            const contentKey = `${r.author.toLowerCase().trim()}_${r.comment.toLowerCase().trim()}`;
            if (!currentContent.has(contentKey)) {
              currentContent.add(contentKey);
              resList.push(r);
            }
          }
          return resList;
        });
      }
    };

    window.addEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    };
  }, [product, initialReviews]);

  const handleReviewSubmitted = (newReview: ProductReview) => {
    setReviews((prev) => {
      const newKey = `${newReview.author.toLowerCase().trim()}_${newReview.comment.toLowerCase().trim()}`;
      if (
        prev.some(
          (r) =>
            `${r.author.toLowerCase().trim()}_${r.comment.toLowerCase().trim()}` ===
            newKey,
        )
      ) {
        return prev;
      }
      return [newReview, ...prev];
    });
  };

  // Compute live summary from reviews
  const summary = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        avg: initialSummary?.averageRating || 0,
        total: initialSummary?.totalReviews || 0,
        recommendedPct: initialSummary?.recommendedPercentage || 0,
        breakdown: initialSummary?.breakdown || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        pctBreakdown: initialSummary?.percentageBreakdown || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    let sum = 0;
    let recs = 0;
    const bd: Record<1 | 2 | 3 | 4 | 5, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((r) => {
      sum += Number(r.rating) || 5;
      const s = Math.max(1, Math.min(5, Math.round(r.rating))) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      bd[s] = (bd[s] || 0) + 1;
      if (r.recommend !== false) recs += 1;
    });

    const avg = Math.round((sum / total) * 10) / 10;
    const recommendedPct = Math.round((recs / total) * 100);
    const pctBreakdown = {
      5: Math.round((bd[5] / total) * 100),
      4: Math.round((bd[4] / total) * 100),
      3: Math.round((bd[3] / total) * 100),
      2: Math.round((bd[2] / total) * 100),
      1: Math.round((bd[1] / total) * 100),
    };

    return {
      avg,
      total,
      recommendedPct,
      breakdown: bd,
      pctBreakdown,
    };
  }, [reviews, initialSummary]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (selectedStarFilter !== null) {
      list = list.filter((r) => Math.round(r.rating) === selectedStarFilter);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "recent") {
      list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return list;
  }, [reviews, selectedStarFilter, sortBy]);

  const handleToggleHelpful = (reviewId: string) => {
    const isNowHelpful = toggleReviewHelpful(reviewId);
    setVotedHelpfulSet((prevSet) => {
      const nextSet = new Set(prevSet);
      if (isNowHelpful) {
        nextSet.add(reviewId);
      } else {
        nextSet.delete(reviewId);
      }
      return nextSet;
    });
  };

  const hasAnyReviews = summary.total > 0;

  if (!isSectionEnabled) return null;

  return (
    <section
      id="reviews"
      className="py-12 border-t border-[#EAE8E1] space-y-8 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Customer Feedback & Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#141416]">
            Customer Reviews
          </h2>
        </div>

        {canWrite && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <svg
              className="w-4 h-4 text-[#ffffff]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Overall Score */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-3 md:border-r md:border-[#EAE8E1] md:pr-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-[#141416] font-normal tracking-tight">
                {hasAnyReviews ? summary.avg.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm font-medium text-[#5E6472]">/ 5.0</span>
            </div>

            {/* Stars */}
            <div
              className={`flex items-center ${hasAnyReviews ? "text-[#A17840]" : "text-[#A17840]/30"}`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    hasAnyReviews && star <= Math.round(summary.avg)
                      ? "fill-current text-[#A17840]"
                      : "fill-none stroke-current"
                  }`}
                  viewBox="0 0 20 20"
                  strokeWidth="1.5"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p className="text-xs text-[#5E6472]">
              {hasAnyReviews ? (
                <>
                  Based on{" "}
                  <span className="font-semibold text-[#141416]">
                    {summary.total} {summary.total === 1 ? "review" : "reviews"}
                  </span>
                </>
              ) : (
                <span>No customer reviews yet</span>
              )}
            </p>

            {hasAnyReviews ? (
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8C734B] font-medium bg-[#8C734B]/10 px-2.5 py-1 rounded-sm">
                <svg
                  className="w-3.5 h-3.5 text-[#8C734B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  {summary.recommendedPct}% of customers recommend this product
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-[#8C734B] font-medium">
                Be the first to share your experience
              </p>
            )}
          </div>

          {/* Middle: Rating Breakdown Bars */}
          <div className="md:col-span-5 space-y-2.5">
            {[5, 4, 3, 2, 1].map((starNumber) => {
              const starKey = starNumber as 1 | 2 | 3 | 4 | 5;
              const count = summary.breakdown[starKey] || 0;
              const pct = summary.pctBreakdown[starKey] || 0;
              const isSelected = selectedStarFilter === starNumber;

              return (
                <button
                  key={starNumber}
                  type="button"
                  disabled={!hasAnyReviews}
                  onClick={() =>
                    hasAnyReviews &&
                    setSelectedStarFilter(isSelected ? null : starNumber)
                  }
                  className={`w-full flex items-center gap-3 text-xs group p-1 rounded-sm transition-colors ${
                    hasAnyReviews
                      ? "cursor-pointer"
                      : "cursor-default opacity-70"
                  } ${
                    isSelected
                      ? "bg-[#FAF9F6] ring-1 ring-[#8C734B]"
                      : "hover:bg-[#FAF9F6]"
                  }`}
                  title={`Filter by ${starNumber} stars`}
                >
                  <span className="w-12 text-left font-medium text-[#141416] group-hover:text-[#8C734B] flex items-center gap-1">
                    <span>{starNumber}</span>
                    <span className="text-[#A17840]">★</span>
                  </span>

                  {/* Progress track */}
                  <div className="flex-1 h-2 bg-[#EAE8E1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8C734B] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-[11px] text-[#5E6472]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: CTA prompt */}
          <div className="md:col-span-3 flex flex-col justify-center items-center text-center p-4 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#141416]">
              Share Your Feedback
            </h3>
            <p className="text-[11px] text-[#5E6472] leading-relaxed">
              Have you tried this product? Help other customers make an informed
              choice.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar (Only shown when there are reviews) */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedStarFilter(null)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                selectedStarFilter === null
                  ? "bg-[#141416] text-[#FAF9F6]"
                  : "bg-white border border-[#EAE8E1] text-[#5E6472] hover:text-[#141416]"
              }`}
            >
              All Reviews ({reviews.length})
            </button>

            {[5, 4, 3, 2, 1].map((s) => {
              const count = summary.breakdown[s as 1 | 2 | 3 | 4 | 5] || 0;
              if (count === 0 && selectedStarFilter !== s) return null;
              return (
                <button
                  key={s}
                  onClick={() =>
                    setSelectedStarFilter(selectedStarFilter === s ? null : s)
                  }
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedStarFilter === s
                      ? "bg-[#8C734B] text-white"
                      : "bg-white border border-[#EAE8E1] text-[#5E6472] hover:text-[#141416]"
                  }`}
                >
                  <span>{s} ★</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}

            {selectedStarFilter !== null && (
              <button
                onClick={() => setSelectedStarFilter(null)}
                className="text-xs text-[#8C734B] hover:underline cursor-pointer ml-1"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs text-[#5E6472]">
            <label
              htmlFor="sort-reviews"
              className="whitespace-nowrap font-medium text-[#141416]"
            >
              Sort by:
            </label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-[#EAE8E1] rounded-sm text-xs text-[#141416] focus:outline-none focus:border-[#141416] cursor-pointer"
            >
              <option value="highest">Highest Rating</option>
              <option value="recent">Most Recent</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white border border-[#EAE8E1] p-8 text-center rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#8C734B] flex items-center justify-center mx-auto border border-[#EAE8E1]">
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-serif text-[#141416]">
                No Customer Reviews Yet
              </h3>
              <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                Be the first to share your experience with other customers using
                the "Write a Review" button above.
              </p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white border border-[#EAE8E1] p-12 text-center rounded-sm space-y-3">
            <p className="text-sm text-[#5E6472]">
              No reviews match the selected star rating.
            </p>
            <button
              onClick={() => setSelectedStarFilter(null)}
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold border border-[#141416] text-[#141416] hover:bg-[#141416] hover:text-white rounded-sm cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {filteredReviews.slice(0, visibleCount).map((review, idx) => {
              const initials = review.author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              const isHelpful = votedHelpfulSet.has(review.id);
              const helpfulCount = (review.helpfulCount || 0) + (isHelpful ? 1 : 0);

              return (
                <div
                  key={`${review.id}-${idx}`}
                  className="bg-white border border-[#EAE8E1] rounded-sm p-4 sm:p-6 space-y-4 transition-all hover:border-[#8C734B]/50"
                >
                  {/* Reviewer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF9F6] pb-3">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      {/* Avatar Initials */}
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#8C734B]/40 text-[#8C734B] flex items-center justify-center font-serif text-xs font-semibold shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-[#141416] break-words">
                            {review.author}
                          </span>
                          {review.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-[#8C734B] bg-[#8C734B]/10 px-2 py-0.5 rounded-sm whitespace-nowrap shrink-0">
                              <svg
                                className="w-3 h-3 text-[#8C734B] shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#5E6472] block">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center text-[#A17840] shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-current text-[#A17840]"
                              : "fill-none stroke-[#A17840]"
                          }`}
                          viewBox="0 0 20 20"
                          strokeWidth="1.5"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Review Body */}
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base font-serif font-medium text-[#141416]">
                      {review.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
                      {review.comment}
                    </p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {Array.from(
                          new Set(
                            review.images
                              .map(cleanReviewImageUrl)
                              .filter(Boolean),
                          ),
                        ).map((cleanImg, imgIdx) => {
                          const fullResImages = Array.from(
                            new Set(
                              review.images!
                                .map(getReviewFullImageUrl)
                                .filter(Boolean),
                            ),
                          );
                          return (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => openLightbox(fullResImages, imgIdx)}
                              className="w-16 h-16 rounded-sm border border-[#EAE8E1] overflow-hidden block hover:border-[#8C734B] transition-all cursor-pointer group relative shadow-xs"
                              aria-label={`View enlarged photo ${imgIdx + 1}`}
                            >
                              <img
                                src={cleanImg}
                                alt={`Review photo ${imgIdx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Review Footer / Recommendation / Helpful */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#FAF9F6]">
                    <div className="flex items-center gap-2">
                      {review.recommend !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#2F5233] font-medium">
                          <svg
                            className="w-3.5 h-3.5 text-[#2F5233]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Recommends this product
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#5E6472]">
                          Neutral evaluation
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReviews.length > visibleCount && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#141416] text-[#141416] hover:bg-[#141416] hover:text-white rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  <span>
                    View More Reviews ({filteredReviews.length - visibleCount}{" "}
                    remaining)
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Submission Modal */}
      <WriteReviewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Lightbox Photo Preview Modal */}
      <ImageLightboxModal
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </section>
  );
};
