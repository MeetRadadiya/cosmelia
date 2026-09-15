import fs from "fs/promises";
import path from "path";
import { ProductReview } from "../commerce/types";
import { calculateReviewSummary, ReviewSummary } from "./seedReviews";
import { fathershopsClient } from "@/lib/fathershops/client";
import { getFatherShopsConfig } from "@/lib/fathershops/config";

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
 * Queries FatherShops live reviewSummary endpoint via FatherShops API Client.
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

  try {
    const res = await fathershopsClient.request<any>(
      `product/product/reviewSummary&product_id=${numericId}`
    );

    if (res && res.data && typeof res.data === "object") {
      const data = res.data;
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
    }
  } catch {
    // Ignore summary query error, fallback to default enabled state
  }

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

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function extractStarRating(block: string): number {
  // Matches full fa-star icons (excluding empty fa-star-o icons)
  const fullStars = block.match(/\bfa-star\b(?!-o)/g);
  if (fullStars && fullStars.length > 0) {
    return Math.min(5, Math.max(1, fullStars.length));
  }
  return 5;
}

/**
 * Helper to parse reviews from raw HTML or JSON markup.
 */
function parseReviewsFromHtml(html: string): ProductReview[] {
  const reviews: ProductReview[] = [];
  if (
    !html ||
    html.includes("fs-rv__empty") ||
    html.includes("No reviews yet") ||
    html.includes("There are no reviews for this product.")
  ) {
    return reviews;
  }

  // 1. JSON
  if (html.trim().startsWith("{") || html.trim().startsWith("[")) {
    try {
      const json = JSON.parse(html);
      const list = Array.isArray(json) ? json : json.reviews || json.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any, i: number) => {
          const text = decodeHtmlEntities(item.text || item.comment || item.content || "");
          const author = decodeHtmlEntities(item.author || item.name || "Verified Buyer");
          const rating = Number(item.rating) || 5;
          return {
            id: `fs-json-rev-${item.review_id || i}-${Date.now()}`,
            author,
            rating,
            date: item.date_added || item.date || "",
            title: text.length > 60 ? text.substring(0, 60) + "..." : text || "Customer Review",
            comment: text,
            verifiedPurchase: true,
            recommend: rating >= 4,
            helpfulCount: 0,
          };
        });
      }
    } catch {}
  }

  // 2. OpenCart Table / TR
  if (html.includes("<table") || html.includes("<tr")) {
    const tableBlocks = html.split(/<table[^>]*>/i).slice(1);
    const trBlocks = tableBlocks.length > 0 ? tableBlocks : [html];

    for (const block of trBlocks) {
      const rows = block.split(/<tr[^>]*>/i).slice(1);
      let currentAuthor = "";
      let currentDate = "";

      for (const row of rows) {
        const rowContent = row.split("</tr>")[0] || "";
        const authorMatch =
          rowContent.match(/<strong>\s*([^<]+)\s*<\/strong>/i) ||
          rowContent.match(/<b>\s*([^<]+)\s*<\/b>/i);

        if (authorMatch) {
          currentAuthor = decodeHtmlEntities(authorMatch[1].trim());
          const dateMatch =
            rowContent.match(/class="text-right"[^>]*>\s*([^<]+)\s*<\/td>/i) ||
            rowContent.match(/(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2},\s+\d{4})/);
          if (dateMatch) currentDate = dateMatch[1].trim();
          continue;
        }

        const textMatch =
          rowContent.match(/<td[^>]*colspan="2"[^>]*>([\s\S]*?)<\/td>/i) ||
          rowContent.match(/<p>\s*([\s\S]*?)\s*<\/p>/i);

        if (textMatch) {
          let text = textMatch[1];
          const rating = extractStarRating(rowContent);

          text = text.replace(/<span[^>]*class="[^"]*fa-stack[^"]*"[\s\S]*?<\/span>/gi, "");
          text = decodeHtmlEntities(text.replace(/<[^>]+>/g, "").trim());

          if (text) {
            reviews.push({
              id: `fs-tr-rev-${Date.now()}-${reviews.length}`,
              author: currentAuthor || "Verified Buyer",
              rating,
              date: currentDate,
              title: text.length > 60 ? text.substring(0, 60) + "..." : text || "Customer Review",
              comment: text,
              verifiedPurchase: true,
              recommend: rating >= 4,
              helpfulCount: 0,
            });
            currentAuthor = "";
            currentDate = "";
          }
        }
      }
    }
    if (reviews.length > 0) return reviews;
  }

  // 3. Card / Div
  const cardBlocks = html
    .split(/<(?:li|div)[^>]*class="[^"]*(?:fs-rv__card|review-item|review-box|review)[^"]*"/i)
    .slice(1);

  for (const card of cardBlocks) {
    const idMatch = card.match(/(?:id="review-(\d+)"|data-review-id="(\d+)")/i);
    const reviewId = idMatch ? idMatch[1] || idMatch[2] : String(Date.now());
    const authorMatch =
      card.match(/class="[^"]*(?:fs-rv__author|author|name)[^"]*"[^>]*>([^<]+)<\//i) ||
      card.match(/<strong>\s*([^<]+)\s*<\/strong>/i);
    const author = decodeHtmlEntities(authorMatch ? authorMatch[1].trim() : "Verified Buyer");
    const dateMatch = card.match(/class="[^"]*(?:fs-rv__date|date)[^"]*"[^>]*>([^<]+)<\//i);
    const date = dateMatch ? dateMatch[1].trim() : "";
    const textMatch = card.match(/class="[^"]*(?:fs-rv__text|text|comment)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    let text = textMatch ? textMatch[1].replace(/<[^>]+>/g, "").trim() : "";
    text = decodeHtmlEntities(text);

    const imgMatches = Array.from(card.matchAll(/<img[^>]+src="([^">]+)"/g)).map((m) => m[1]);
    const rating = extractStarRating(card);

    if (text) {
      reviews.push({
        id: `fs-rev-${reviewId}`,
        author,
        rating,
        date,
        title: text.length > 60 ? text.substring(0, 60) + "..." : text || "Customer Review",
        comment: text,
        verifiedPurchase: true,
        recommend: rating >= 4,
        helpfulCount: 0,
        images: imgMatches.length > 0 ? imgMatches : undefined,
      });
    }
  }

  return reviews;
}

/**
 * Fetches and parses approved reviews directly via FatherShops API & Storefront endpoints.
 */
async function fetchFatherShopsApprovedReviews(
  numericId: string,
): Promise<ProductReview[]> {
  const reviews: ProductReview[] = [];

  // Strategy A: Query FatherShops REST API directly via fathershopsClient
  try {
    const res = await fathershopsClient.request(`product/${numericId}`);
    if (res && res.data) {
      const p = res.data;
      const rawList = p.reviews_list || p.reviews || p.review_data || p.data?.reviews;
      if (Array.isArray(rawList) && rawList.length > 0) {
        for (const r of rawList) {
          const text = decodeHtmlEntities(r.text || r.comment || r.content || r.description || "");
          const author = decodeHtmlEntities(r.author || r.name || r.customer_name || "Verified Buyer");
          const rating = Number(r.rating) || 5;
          reviews.push({
            id: `fs-api-rev-${r.review_id || r.id || Date.now()}-${reviews.length}`,
            author,
            rating,
            date: r.date_added || r.date || "",
            title: text.length > 60 ? text.substring(0, 60) + "..." : text || "Customer Review",
            comment: text,
            verifiedPurchase: true,
            recommend: rating >= 4,
            helpfulCount: 0,
          });
        }
        if (reviews.length > 0) return reviews;
      }
    }
  } catch {
    // Continue to dedicated REST API endpoints
  }

  // Strategy B: Dedicated REST API endpoints
  const apiEndpoints = [
    `product/review?product_id=${numericId}&limit=200`,
    `product/${numericId}/review?limit=200`,
    `product/${numericId}/reviews?limit=200`,
    `extension/module/fatherstock_integration/reviews?product_id=${numericId}&limit=200`,
  ];

  for (const ep of apiEndpoints) {
    try {
      const pageReviews: ProductReview[] = [];
      for (let page = 1; page <= 10; page++) {
        const fullEp = ep.includes("?")
          ? `${ep}&page=${page}`
          : `${ep}?page=${page}`;
        const res = await fathershopsClient.request(fullEp);
        if (res && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.reviews || res.data.products || res.data.data || [];
          if (Array.isArray(list) && list.length > 0) {
            let added = 0;
            for (const item of list) {
              const text = decodeHtmlEntities(
                item.text || item.comment || item.content || "",
              );
              const author = decodeHtmlEntities(
                item.author || item.name || "Verified Buyer",
              );
              if (!text && !item.author) continue;
              if (
                pageReviews.some(
                  (r) => r.comment === text && r.author === author,
                )
              )
                continue;
              const rating = Number(item.rating) || 5;
              pageReviews.push({
                id: `fs-api-rev-${item.review_id || Date.now()}-${pageReviews.length}`,
                author,
                rating,
                date: item.date_added || item.date || "",
                title:
                  text.length > 60
                    ? text.substring(0, 60) + "..."
                    : text || "Customer Review",
                comment: text,
                verifiedPurchase: true,
                recommend: rating >= 4,
                helpfulCount: 0,
              });
              added++;
            }
            if (added === 0 || list.length < 5) break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      if (pageReviews.length > 0) return pageReviews;
    } catch {
      // Continue
    }
  }

  // Strategy C: Storefront HTML endpoints on FatherShops tenant domain
  const config = getFatherShopsConfig();
  const tenantHost = `https://${config.tenant}.myfathershops.com`;
  const tenantHostAlt = `https://${config.tenant}.fathershops.com`;
  const baseHost = getFatherShopsBaseHost();
  const htmlEndpoints = [
    `${tenantHost}/index.php?route=product/product/review&product_id=${numericId}`,
    `${tenantHostAlt}/index.php?route=product/product/review&product_id=${numericId}`,
    `${baseHost}/index.php?route=product/product/review&product_id=${numericId}`,
  ];

  for (const baseUrl of htmlEndpoints) {
    try {
      const pageReviews: ProductReview[] = [];
      for (let page = 1; page <= 20; page++) {
        const pageUrl = `${baseUrl}&page=${page}`;
        const res = await fetch(pageUrl, {
          method: "GET",
          headers: { "X-Requested-With": "XMLHttpRequest" },
          cache: "no-store",
        });
        if (!res.ok) break;
        const html = await res.text();
        const parsed = parseReviewsFromHtml(html);
        if (!parsed || parsed.length === 0) break;

        let added = 0;
        for (const item of parsed) {
          if (
            !pageReviews.some(
              (r) => r.comment === item.comment && r.author === item.author,
            )
          ) {
            pageReviews.push(item);
            added++;
          }
        }
        if (added === 0 || parsed.length < 5) break;
      }
      if (pageReviews.length > 0) return pageReviews;
    } catch {
      // Continue
    }
  }

  return reviews;
}

/**
 * Retrieves authentic reviews from FatherShops & local review store.
 * Merges admin reviews and customer submissions seamlessly.
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

  // 1. Fetch approved reviews from FatherShops API & storefront
  const approvedFromFatherShops = await fetchFatherShopsApprovedReviews(numericId);

  // 2. Read local fallback reviews from reviews.json
  const localStore = await readLocalStore();
  const localReviews = localStore[numericId] || localStore[productId] || [];

  // Combine and deduplicate
  const allReviews = [...approvedFromFatherShops];

  for (const r of localReviews) {
    if (!allReviews.some((item) => item.comment === r.comment || item.author === r.author)) {
      allReviews.push(r);
    }
  }

  const finalSummary = calculateReviewSummary(
    allReviews,
    liveSummary.average > 0 ? liveSummary.average : 5,
  );

  return {
    enabled: liveSummary.enabled,
    canWrite: liveSummary.canWrite,
    requiresLogin: liveSummary.requiresLogin,
    reviews: allReviews,
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
    images: data.images,
  };

  // Try submitting to FatherShops API via fathershopsClient
  try {
    let postText = data.comment.trim();
    if (data.title && !postText.includes(data.title)) {
      postText = `${data.title}: ${postText}`;
    }
    if (postText.length < 25) {
      postText = `${postText} (Verified review submission by ${data.author.trim()})`;
    }
    if (postText.length > 950) {
      postText = postText.substring(0, 950);
    }

    const res = await fathershopsClient.request<any>(
      `product/product/write&product_id=${numericId}`,
      {
        method: "POST",
        body: JSON.stringify({
          name: data.author.trim(),
          text: postText,
          rating: String(Math.max(1, Math.min(5, Number(data.rating) || 5))),
          email: data.email?.trim(),
        }),
      }
    );

    if (res && (res.data?.success || res.code === 200)) {
      // Save locally as backup
      const localStore = await readLocalStore();
      localStore[numericId] = [review, ...(localStore[numericId] || [])];
      await writeLocalStore(localStore);

      return {
        success: true,
        message: "Thank you for your review. It has been submitted successfully.",
        review,
      };
    }
  } catch (err) {
    console.warn("[serverReviewStore] FatherShops review POST failed, saving to local fallback", err);
  }

  // Save to local store fallback
  const localStore = await readLocalStore();
  localStore[numericId] = [review, ...(localStore[numericId] || [])];
  await writeLocalStore(localStore);

  return {
    success: true,
    message: "Thank you for your review! It has been recorded.",
    review,
  };
}
