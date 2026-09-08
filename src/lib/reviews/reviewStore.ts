"use client";

import { ProductReview } from "../commerce/types";
import { getDefaultReviews, calculateReviewSummary, ReviewSummary } from "./seedReviews";

const STORAGE_PREFIX = "cosmelia_reviews_v2_";
const HELPFUL_STORAGE_KEY = "cosmelia_helpful_reviews_v1";
export const REVIEWS_UPDATED_EVENT = "cosmelia:reviews-updated";

export interface ReviewsUpdateEventDetail {
  productId: string;
  totalReviews: number;
  averageRating: number;
}

/**
 * Loads persisted user reviews from localStorage combined with seed reviews.
 */
export function getProductReviews(product: {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}): { reviews: ProductReview[]; summary: ReviewSummary } {
  const seed = getDefaultReviews(product);
  const baseRating = Number(product.rating) || 0;

  if (typeof window === "undefined") {
    const summary = calculateReviewSummary(seed, baseRating);
    return { reviews: seed, summary };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${product.id}`);
    if (!raw) {
      const summary = calculateReviewSummary(seed, baseRating);
      return { reviews: seed, summary };
    }

    const userReviews: ProductReview[] = JSON.parse(raw);
    if (!Array.isArray(userReviews)) {
      const summary = calculateReviewSummary(seed, baseRating);
      return { reviews: seed, summary };
    }

    // Combine user-submitted reviews first, then seed reviews, strictly deduplicated by ID
    const seenIds = new Set<string>();
    const combined: ProductReview[] = [];
    for (const item of [...userReviews, ...seed]) {
      if (item && item.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        combined.push(item);
      }
    }

    const summary = calculateReviewSummary(combined, baseRating);
    return { reviews: combined, summary };
  } catch (err) {
    console.error("Error reading reviews from localStorage", err);
    const summary = calculateReviewSummary(seed, baseRating);
    return { reviews: seed, summary };
  }
}

/**
 * Adds a new review for the given product, saves to localStorage, and emits an update event.
 */
export function addProductReview(
  product: { id: string; name: string; category?: string; rating?: number },
  newReviewData: {
    author: string;
    rating: number;
    title: string;
    comment: string;
    recommend?: boolean;
    email?: string;
  }
): { review: ProductReview; summary: ReviewSummary; allReviews: ProductReview[] } {
  const newReview: ProductReview = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    author: newReviewData.author.trim() || "Verified Buyer",
    rating: Number(newReviewData.rating) || 5,
    date: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date()),
    title: newReviewData.title.trim() || "Exceptional results",
    comment: newReviewData.comment.trim(),
    verifiedPurchase: true,
    recommend: newReviewData.recommend !== false,
    helpfulCount: 0,
  };

  let userReviews: ProductReview[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${product.id}`);
      if (raw) {
        userReviews = JSON.parse(raw) || [];
      }
    } catch {}
  }

  // Prepend new review and filter out any accidental duplicates
  userReviews = [newReview, ...userReviews.filter((r) => r.id !== newReview.id)];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${product.id}`, JSON.stringify(userReviews));
    } catch (err) {
      console.error("Failed to persist review", err);
    }
  }

  const seed = getDefaultReviews(product);
  const seenIds = new Set<string>();
  const allReviews: ProductReview[] = [];
  for (const item of [...userReviews, ...seed]) {
    if (item && item.id && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      allReviews.push(item);
    }
  }
  const summary = calculateReviewSummary(allReviews, Number(product.rating) || 0);

  // Broadcast event across components
  if (typeof window !== "undefined") {
    const detail: ReviewsUpdateEventDetail = {
      productId: product.id,
      totalReviews: summary.totalReviews,
      averageRating: summary.averageRating,
    };
    window.dispatchEvent(new CustomEvent(REVIEWS_UPDATED_EVENT, { detail }));
  }

  return { review: newReview, summary, allReviews };
}

/**
 * Check if the user has already marked a review helpful
 */
export function isReviewHelpful(reviewId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(HELPFUL_STORAGE_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    return set.includes(reviewId);
  } catch {
    return false;
  }
}

/**
 * Mark a review helpful and persist state
 */
export function toggleReviewHelpful(reviewId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(HELPFUL_STORAGE_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    const exists = set.includes(reviewId);
    const updated = exists ? set.filter((id) => id !== reviewId) : [...set, reviewId];
    localStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}
