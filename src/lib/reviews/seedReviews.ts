import { ProductReview } from "../commerce/types";

export interface ReviewBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: ReviewBreakdown;
  percentageBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  recommendedPercentage: number;
}

/**
 * Returns authentic reviews. Default is empty (no fake/static seed reviews).
 */
export function getDefaultReviews(product?: {
  id: string;
  name?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}): ProductReview[] {
  return [];
}

/**
 * Computes live rating summary and distribution breakdown from real reviews.
 */
export function calculateReviewSummary(
  reviews: ProductReview[],
  fallbackRating = 0
): ReviewSummary {
  const breakdown: ReviewBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: fallbackRating > 0 ? fallbackRating : 0,
      totalReviews: 0,
      breakdown,
      percentageBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendedPercentage: 0,
    };
  }

  let totalScore = 0;
  let recommendCount = 0;

  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[star] = (breakdown[star] || 0) + 1;
    totalScore += r.rating;
    if (r.recommend !== false) {
      recommendCount += 1;
    }
  });

  const totalReviews = reviews.length;
  const rawAvg = totalScore / totalReviews;
  const averageRating = Math.round(rawAvg * 10) / 10;

  const percentageBreakdown: Record<1 | 2 | 3 | 4 | 5, number> = {
    5: Math.round((breakdown[5] / totalReviews) * 100),
    4: Math.round((breakdown[4] / totalReviews) * 100),
    3: Math.round((breakdown[3] / totalReviews) * 100),
    2: Math.round((breakdown[2] / totalReviews) * 100),
    1: Math.round((breakdown[1] / totalReviews) * 100),
  };

  const recommendedPercentage = Math.round((recommendCount / totalReviews) * 100);

  return {
    averageRating,
    totalReviews,
    breakdown,
    percentageBreakdown,
    recommendedPercentage,
  };
}
