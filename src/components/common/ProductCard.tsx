"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../lib/commerce/types";
import { formatPrice } from "../../lib/utils/format";
import { Badge } from "../ui/Badge";
import { RatingStars } from "./RatingStars";
import { useCart } from "../../lib/context/CartContext";
import { useAccount } from "../../lib/context/AccountContext";
import { useLocale } from "../../lib/context/LocaleContext";
import { useCompare } from "../../lib/context/CompareContext";
import {
  getProductReviews,
  REVIEWS_UPDATED_EVENT,
  ReviewsUpdateEventDetail,
} from "../../lib/reviews/reviewStore";

interface ProductCardProps {
  product: Product;
}

/** Inline SVG placeholder rendered when the CDN image fails or returns an SVG stub */
const ImagePlaceholder = ({ name }: { name: string }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F4EF] to-[#EAE8E1] gap-2">
    <svg className="w-10 h-10 text-[#C5A059]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="text-[9px] text-[#8C734B]/60 font-medium uppercase tracking-wider px-2 text-center line-clamp-2 max-w-[80%]">
      {name}
    </span>
  </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toggleWishlist } = useAccount();
  const { formatCurrencyAmount } = useLocale();
  const { toggleCompare, isInCompare } = useCompare();

  const isCompared = isInCompare(product.id);

  const [thumbError, setThumbError] = useState(false);
  const [hoverError, setHoverError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [liveRating, setLiveRating] = useState<number>(() => product.rating || 0);
  const [liveCount, setLiveCount] = useState<number>(() => product.reviewCount || 0);

  useEffect(() => {
    // 1. Initial sync with local reviewStore
    const { summary } = getProductReviews(product);
    if (summary.totalReviews > 0) {
      setLiveCount(summary.totalReviews);
      setLiveRating(summary.averageRating);
    } else if (product.rating && product.rating > 0) {
      setLiveRating(product.rating);
      setLiveCount(product.reviewCount || 0);
    }

    // 2. Fetch fresh rating & review count from server API
    fetch(`/api/products/${encodeURIComponent(product.id)}/reviews`, { cache: "force-cache" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.summary && data.summary.totalReviews > 0) {
          setLiveCount(data.summary.totalReviews);
          setLiveRating(data.summary.averageRating);
        }
      })
      .catch(() => {});

    // 3. Subscribe to real-time review updates across components
    const handleReviewsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ReviewsUpdateEventDetail>;
      if (customEvent.detail && customEvent.detail.productId === product.id) {
        setLiveCount(customEvent.detail.totalReviews);
        setLiveRating(customEvent.detail.averageRating);
      }
    };

    window.addEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleReviewsUpdated);
    };
  }, [product.id, product.rating, product.reviewCount]);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = JSON.parse(localStorage.getItem("cosmelia_wishlist") || "[]");
      return Array.isArray(saved) && saved.includes(product.id);
    } catch {
      return false;
    }
  });

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addItem(product, 1);
    } catch (err) {
      console.error("[ProductCard] Quick add error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    try {
      const saved = JSON.parse(localStorage.getItem("cosmelia_wishlist") || "[]");
      const updated = nextState
        ? Array.from(new Set([...saved, product.id]))
        : saved.filter((id: string) => id !== product.id);
      localStorage.setItem("cosmelia_wishlist", JSON.stringify(updated));
    } catch {}

    try {
      await toggleWishlist(product.id);
    } catch {}
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[#EAE8E1]/80 rounded-sm overflow-hidden hover:border-[#C5A059]/60 transition-all duration-300 hover:shadow-lg">
      {/* Thumbnail Area */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#F5F4EF] block">
        {thumbError || !product.thumbnail ? (
          <ImagePlaceholder name={product.name} />
        ) : (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={() => setThumbError(true)}
            unoptimized
          />
        )}

        {product.hoverImage && !hoverError && product.hoverImage !== product.thumbnail && (
          <Image
            src={product.hoverImage}
            alt={`${product.name} alternate`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            onError={() => setHoverError(true)}
            unoptimized
          />
        )}

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.badges.map((b, idx) => (
              <Badge key={idx} variant={b.variant}>
                {b.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist button"
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "fill-none stroke-[#141416] hover:text-red-500"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Compare Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product);
          }}
          title={isCompared ? "Remove from comparison" : "Compare this product"}
          aria-label="Compare button"
          className={`absolute top-11 right-2.5 z-20 w-7 h-7 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
            isCompared
              ? "bg-[#141416] text-[#C5A059] ring-1 ring-[#C5A059]/40"
              : "bg-white/90 text-[#141416] hover:text-[#8C734B]"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isCompared ? "2.2" : "1.8"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>

        {/* Quick Add Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 bg-black/95 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 shadow-md rounded-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-80"
          >
            {isAdding ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <span>+ Quick Add</span>
            )}
          </button>
        </div>
      </Link>

      {/* Info Area */}
      <div className="p-3.5 md:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-widest uppercase text-[#8C734B] font-semibold truncate max-w-[120px]">
              {product.category}
            </span>
            <RatingStars rating={liveRating} reviewCount={liveCount} />
          </div>

          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="text-xs md:text-sm font-medium text-[#141416] line-clamp-1 group-hover/title:text-[#8C734B] transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.tagline && (
            <p className="text-[11px] text-[#5E6472] line-clamp-1 mt-0.5 font-light">{product.tagline}</p>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#EAE8E1]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-semibold text-[#141416]">
              {formatCurrencyAmount(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#8B92A2] line-through">
                {formatCurrencyAmount(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label="Add to cart"
            className="md:hidden p-2 text-[#141416] hover:text-[#8C734B] active:scale-95 transition-transform disabled:opacity-50"
          >
            {isAdding ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
