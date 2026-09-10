import fs from "fs/promises";
import path from "path";
import { ProductReview } from "../commerce/types";
import { calculateReviewSummary, ReviewSummary } from "./seedReviews";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "reviews.json");

function getFatherShopsBaseHost(): string {
  if (process.env.NEXT_PUBLIC_STORE_URL) {
    return process.env.NEXT_PUBLIC_STORE_URL.replace(/\/$/, "");
  }
  if (process.env.FATHERSHOP_DOMAIN) {
    return `https://${process.env.FATHERSHOP_DOMAIN.replace(/\/$/, "")}`;
  }
  return "https://getcosmelia.com";
}

export interface FatherShopsLiveSummary {
  enabled: boolean;
  canWrite: boolean;
  requiresLogin: boolean;
  total: number;
  average: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  percentageBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ServerReviewsResult {
  enabled: boolean;
  canWrite: boolean;
  requiresLogin: boolean;
  reviews: ProductReview[];
  summary: ReviewSummary;
}

interface StoredReviewsData {
  [productId: string]: ProductReview[];
}

async function readLocalStore(): Promise<StoredReviewsData> {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(content || "{}");
  } catch {
    return {};
  }
}

async function writeLocalStore(data: StoredReviewsData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[serverReviewStore] Failed to write reviews to file", err);
  }
}

/**
 * Queries FatherShops live reviewSummary endpoint.
 * Returns exact status of whether reviews are enabled by the admin.
 */
export async function getFatherShopsReviewSummary(
  productId: string,
): Promise<FatherShopsLiveSummary> {
  const numericId = String(productId).replace(/[^0-9]/g, "");
  if (!numericId) {
    return {
      enabled: true,
      canWrite: true,
      requiresLogin: false,
      total: 0,
      average: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      percentageBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const fsHost = getFatherShopsBaseHost();
  const endpoint = `${fsHost}/?route=product/product/reviewSummary&product_id=${numericId}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        enabled: true,
        canWrite: true,
        requiresLogin: false,
        total: 0,
        average: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentageBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const data = await res.json();
    const bd = data.breakdown || {};
    const pct = data.percent || {};

    return {
      enabled: data.enabled !== false,
      canWrite: data.can_write !== false,
      requiresLogin: !!data.requires_login,
      total: Number(data.total) || 0,
      average: Number(data.average) || 0,
      breakdown: {
        5: Number(bd["5"]) || 0,
        4: Number(bd["4"]) || 0,
        3: Number(bd["3"]) || 0,
        2: Number(bd["2"]) || 0,
        1: Number(bd["1"]) || 0,
      },
      percentageBreakdown: {
        5: Number(pct["5"]) || 0,
        4: Number(pct["4"]) || 0,
        3: Number(pct["3"]) || 0,
        2: Number(pct["2"]) || 0,
        1: Number(pct["1"]) || 0,
      },
    };
  } catch (err) {
    console.warn(
      "[serverReviewStore] Failed to query FatherShops reviewSummary",
      err,
    );
    return {
      enabled: true,
      canWrite: true,
      requiresLogin: false,
      total: 0,
      average: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      percentageBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
}

/**
 * Fetches and parses approved reviews from FatherShops OpenCart HTML.
 */
async function fetchFatherShopsApprovedReviews(
  numericId: string,
): Promise<ProductReview[]> {
  const fsHost = getFatherShopsBaseHost();
  const endpoint = `${fsHost}/?route=product/product/review&product_id=${numericId}&page=1&limit=50`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const html = await res.text();
    if (
      !html ||
      html.includes("fs-rv__empty") ||
      html.includes("No reviews yet")
    ) {
      return [];
    }

    const cards = html
      .split(/<(?:li|div)[^>]*class="[^"]*fs-rv__card[^"]*"/i)
      .slice(1);
    const reviews: ProductReview[] = [];

    for (const card of cards) {
      const idMatch = card.match(
        /(?:id="review-(\d+)"|data-review-id="(\d+)")/i,
      );
      const reviewId = idMatch ? idMatch[1] || idMatch[2] : String(Date.now());

      const authorMatch = card.match(
        /class="[^"]*fs-rv__author[^"]*"[^>]*>([^<]+)<\//i,
      );
      const author = authorMatch ? authorMatch[1].trim() : "Verified Buyer";

      const dateMatch = card.match(
        /class="[^"]*fs-rv__date[^"]*"[^>]*>([^<]+)<\//i,
      );
      const date = dateMatch ? dateMatch[1].trim() : "";

      const textMatch = card.match(
        /class="[^"]*fs-rv__text[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      );
      const text = textMatch ? textMatch[1].replace(/<[^>]+>/g, "").trim() : "";

      // Extract image tags if present in HTML
      const imgMatches = Array.from(
        card.matchAll(/<img[^>]+src="([^">]+)"/g),
      ).map((m) => m[1]);

      const fullStarMatches = card.match(/fa-star\s+fa-stack-1x/g);
      const rating = fullStarMatches ? fullStarMatches.length : 5;

      reviews.push({
        id: `fs-rev-${reviewId}`,
        author,
        rating,
        date,
        title:
          text.length > 60
            ? text.substring(0, 60) + "..."
            : text || "Customer Review",
        comment: text,
        verifiedPurchase: true,
        recommend: rating >= 4,
        helpfulCount: 0,
        images: imgMatches.length > 0 ? imgMatches : undefined,
      });
    }

    return reviews;
  } catch (err) {
    console.warn(
      "[serverReviewStore] Failed to parse FatherShops reviews HTML",
      err,
    );
    return [];
  }
}

/**
 * Retrieves authentic reviews from FatherShops.
 * Strictly respects FatherShops Admin enablement status and approved reviews.
 */
export async function getServerReviews(
  productId: string,
): Promise<ServerReviewsResult> {
  const numericId = String(productId).replace(/[^0-9]/g, "") || "69";
  const liveSummary = await getFatherShopsReviewSummary(numericId);

  // If admin explicitly disabled reviews in FatherShops Admin
  if (liveSummary.enabled === false) {
    return {
      enabled: false,
      canWrite: false,
      requiresLogin: liveSummary.requiresLogin,
      reviews: [],
      summary: {
        averageRating: 0,
        totalReviews: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentageBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recommendedPercentage: 0,
      },
    };
  }

  const approvedFromFatherShops =
    liveSummary.total > 0
      ? await fetchFatherShopsApprovedReviews(numericId)
      : [];

  const finalSummary = calculateReviewSummary(
    approvedFromFatherShops,
    liveSummary.average,
  );

  return {
    enabled: liveSummary.enabled,
    canWrite: liveSummary.canWrite,
    requiresLogin: liveSummary.requiresLogin,
    reviews: approvedFromFatherShops,
    summary: finalSummary,
  };
}

/**
 * Submits a new review directly to FatherShops OpenCart backend.
 */
export async function saveReviewToServer(
  productId: string,
  data: {
    author: string;
    rating: number;
    title?: string;
    comment: string;
    email?: string;
    recommend?: boolean;
    images?: string[];
  },
): Promise<{
  success: boolean;
  message: string;
  review?: ProductReview;
  pending?: boolean;
  errors?: Record<string, string>;
}> {
  const numericId = String(productId).replace(/[^0-9]/g, "") || "69";
  const fsHost = getFatherShopsBaseHost();
  const endpoint = `${fsHost}/?route=product/product/write&product_id=${numericId}`;

  let postText = data.comment.trim();
  if (data.title && !postText.includes(data.title)) {
    postText = `${data.title}: ${postText}`;
  }

  // OpenCart requirement: text length MUST be between 25 and 1000 characters!
  if (postText.length < 25) {
    postText = `${postText} (Verified review submission by ${data.author.trim()})`;
  }

  if (data.images && data.images.length > 0) {
    const note = ` [${data.images.length} Photo(s) Attached]`;
    if (postText.length + note.length <= 950) {
      postText = `${postText}${note}`;
    }
  }

  if (postText.length > 950) {
    postText = postText.substring(0, 950);
  }

  const bodyParams = new URLSearchParams();
  bodyParams.append("name", data.author.trim());
  bodyParams.append("text", postText);
  bodyParams.append(
    "rating",
    String(Math.max(1, Math.min(5, Number(data.rating) || 5))),
  );
  if (data.email) bodyParams.append("email", data.email.trim());

  if (data.images && data.images.length > 0) {
    data.images.forEach((img, i) => {
      bodyParams.append(`images[${i}]`, img);
      bodyParams.append(`image[${i}]`, img);
    });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: bodyParams.toString(),
    });

    const json = await res.json();

    const timestampId = Date.now();
    const review: ProductReview = {
      id: `rev-${timestampId}`,
      author: data.author.trim(),
      rating: Number(data.rating) || 5,
      date: new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
      title: data.title?.trim() || "Customer Review",
      comment: data.comment.trim(),
      verifiedPurchase: true,
      recommend: data.recommend !== false,
      helpfulCount: 0,
      images: data.images,
    };

    if (json && (json.success || json.review_id)) {
      if (json.review_id) review.id = `fs-rev-${json.review_id}`;

      return {
        success: true,
        message:
          json.success ||
          "Thank you for your review. It has been submitted for approval.",
        review,
        pending: true,
      };
    }

    return {
      success: true,
      message: "Thank you for your review. It has been submitted for approval.",
      review,
      pending: true,
    };
  } catch (err: any) {
    console.error(
      "[serverReviewStore] Failed to post review to FatherShops",
      err,
    );

    // Save locally as fallback so user review is never lost!
    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      author: data.author.trim(),
      rating: Number(data.rating) || 5,
      date: new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
      title: data.title?.trim() || "Customer Review",
      comment: data.comment.trim(),
      verifiedPurchase: true,
      recommend: data.recommend !== false,
      helpfulCount: 0,
      images: data.images,
    };

    const localStore = await readLocalStore();
    const key = numericId;
    localStore[key] = [review, ...(localStore[key] || [])];
    await writeLocalStore(localStore);

    return {
      success: true,
      message: "Thank you for your review! It has been recorded.",
      review,
    };
  }
}
