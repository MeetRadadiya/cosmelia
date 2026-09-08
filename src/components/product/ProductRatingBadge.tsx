"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/lib/commerce/types";
import {
  getProductReviews,
  REVIEWS_UPDATED_EVENT,
  ReviewsUpdateEventDetail,
} from "@/lib/reviews/reviewStore";

interface ProductRatingBadgeProps {
  product: Product;
  initialRating?: number;
  initialReviewCount?: number;
  size?: "sm" | "md";
}

export const ProductRatingBadge: React.FC<ProductRatingBadgeProps> = ({
  product,
  initialRating,
  initialReviewCount,
  size = "md",
}) => {
  const [rating, setRating] = useState(
    typeof initialRating === "number" ? initialRating : (product.rating || 0)
  );
  const [reviewCount, setReviewCount] = useState(
    typeof initialReviewCount === "number" ? initialReviewCount : (product.reviewCount || 0)
  );

  useEffect(() => {
    // Initial sync with localStorage / server
    const { summary } = getProductReviews(product);
    if (typeof initialRating !== "number") {
      setRating(summary.averageRating);
      setReviewCount(summary.totalReviews);
    }

    const handleReviewsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ReviewsUpdateEventDetail>;
      if (customEvent.detail && customEvent.detail.productId === product.id) {
        setRating(customEvent.detail.averageRating);
        setReviewCount(customEvent.detail.totalReviews);
      }
    };

    window.addEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    };
  }, [product]);

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById("reviews");
    if (reviewsEl) {
      const headerOffset = 100;
      const elementPosition = reviewsEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const hasReviews = reviewCount > 0 && rating > 0;

  return (
    <button
      onClick={scrollToReviews}
      type="button"
      className="inline-flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
      title={hasReviews ? `Read ${reviewCount} customer reviews` : "Be the first to review"}
      aria-label={
        hasReviews
          ? `${rating.toFixed(1)} out of 5 stars based on ${reviewCount} reviews. Click to read reviews.`
          : "0 reviews. Click to write a review."
      }
    >
      <div className={`flex items-center ${hasReviews ? "text-[#A17840]" : "text-[#A17840]/40"}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${iconSize} ${
              hasReviews && star <= Math.round(rating)
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

      {hasReviews ? (
        <>
          <span className="text-xs font-semibold text-[#141416] group-hover:text-[#8C734B] transition-colors">
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-[#5E6472] underline underline-offset-2 decoration-[#EAE8E1] group-hover:decoration-[#8C734B] transition-colors">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </>
      ) : (
        <span className="text-[11px] text-[#5E6472] underline underline-offset-2 decoration-[#EAE8E1] group-hover:decoration-[#8C734B] transition-colors">
          0 reviews · Write a review
        </span>
      )}
    </button>
  );
};
