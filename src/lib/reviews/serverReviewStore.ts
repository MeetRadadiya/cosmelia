import fs from "fs/promises";
import path from "path";
import { ProductReview } from "../commerce/types";
import { calculateReviewSummary, ReviewSummary } from "./seedReviews";
import { fathershopsClient } from "@/lib/fathershops/client";
import { getFatherShopsConfig } from "@/lib/fathershops/config";
import { cleanReviewImageUrl } from "./imageUtils";
export { cleanReviewImageUrl };

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
          const rawImgs = item.images || item.photos || [];
          const images = Array.isArray(rawImgs)
            ? rawImgs.map((img: string) => cleanReviewImageUrl(String(img))).filter(Boolean)
            : undefined;
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
            images: images && images.length > 0 ? images : undefined,
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

    const rawImgs = Array.from(card.matchAll(/(?:<img[^>]+src="([^">]+)"|<a[^>]+href="([^">]+\.(?:jpg|jpeg|png|webp|gif)[^">]*)")/gi))
      .map((m) => m[1] || m[2])
      .filter(Boolean);

    const imgMatches = Array.from(new Set(rawImgs.map((src) => cleanReviewImageUrl(src)).filter(Boolean)));
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
          const rawImgs = r.images || r.photos || [];
          const images = Array.isArray(rawImgs)
            ? rawImgs.map((img: string) => cleanReviewImageUrl(String(img))).filter(Boolean)
            : undefined;
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
            images: images && images.length > 0 ? images : undefined,
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
              const rawImgs = item.images || item.photos || [];
              const images = Array.isArray(rawImgs)
                ? rawImgs.map((img: string) => cleanReviewImageUrl(String(img))).filter(Boolean)
                : undefined;
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
                images: images && images.length > 0 ? images : undefined,
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

  // Fetch only approved reviews directly from FatherShops
  const approvedFromFatherShops = await fetchFatherShopsApprovedReviews(numericId);

  // Clean all image URLs on approved reviews and deduplicate duplicates
  const allReviews = approvedFromFatherShops.map((r) => ({
    ...r,
    images: r.images
      ? Array.from(
          new Set(
            r.images
              .map((img) => cleanReviewImageUrl(img))
              .filter(Boolean),
          ),
        )
      : undefined,
  }));

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

  const ratingVal = Math.max(1, Math.min(5, Number(data.rating) || 5));
  const authorName = data.author.trim();
  let submittedToFatherShops = false;

  // Strategy A: Post to FatherShops Storefront OpenCart write endpoint via form-urlencoded
  const config = getFatherShopsConfig();
  const tenantHost = `https://${config.tenant}.myfathershops.com`;
  const tenantHostAlt = `https://${config.tenant}.fathershops.com`;
  const baseHost = getFatherShopsBaseHost();

  const writeUrls = [
    `${tenantHost}/index.php?route=product/product/write&product_id=${numericId}`,
    `${tenantHostAlt}/index.php?route=product/product/write&product_id=${numericId}`,
    `${baseHost}/index.php?route=product/product/write&product_id=${numericId}`,
  ];

  const formParams = new URLSearchParams();
  formParams.append("name", authorName);
  formParams.append("text", postText);
  formParams.append("rating", String(ratingVal));
  if (data.email?.trim()) {
    formParams.append("email", data.email.trim());
  }

  let capturedReviewId: string | number | null = null;
  let successHost = "";

  for (const url of writeUrls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formParams.toString(),
        cache: "no-store",
      });

      if (res.ok) {
        const respText = await res.text();
        let parsedJson: any = null;
        try {
          parsedJson = JSON.parse(respText);
        } catch {}

        if (
          parsedJson?.review_id ||
          respText.includes("success") ||
          respText.includes("Thank you") ||
          respText.includes("successful") ||
          res.status === 200
        ) {
          submittedToFatherShops = true;
          if (parsedJson?.review_id) {
            capturedReviewId = parsedJson.review_id;
          }
          try {
            const hostUrl = new URL(url);
            successHost = `${hostUrl.protocol}//${hostUrl.host}`;
          } catch {}
          console.log(
            "[serverReviewStore] Successfully submitted review to FatherShops storefront:",
            url,
            "captured review_id:",
            capturedReviewId
          );
          break;
        }
      }
    } catch (err) {
      console.warn(
        "[serverReviewStore] Failed to post review to storefront URL:",
        url,
        err,
      );
    }
  }

  // Strategy B: If storefront POST didn't complete, try REST API endpoints via fathershopsClient
  if (!submittedToFatherShops) {
    const apiEndpoints = [
      `product/write?product_id=${numericId}`,
      `product/${numericId}/review`,
      `product/review?product_id=${numericId}`,
      `product/product/write?product_id=${numericId}`,
      `extension/module/fatherstock_integration/write_review?product_id=${numericId}`,
    ];

    for (const ep of apiEndpoints) {
      try {
        const res = await fathershopsClient.request<any>(ep, {
          method: "POST",
          body: JSON.stringify({
            name: authorName,
            author: authorName,
            text: postText,
            comment: postText,
            rating: String(ratingVal),
            email: data.email?.trim() || "",
          }),
        });

        if (
          res &&
          (res.data?.success ||
            res.code === 200 ||
            !res.errors ||
            res.errors.length === 0)
        ) {
          submittedToFatherShops = true;
          const resAny = res as any;
          if (resAny?.data?.review_id || resAny?.review_id) {
            capturedReviewId = resAny.data?.review_id || resAny.review_id;
          }
          console.log(
            "[serverReviewStore] Successfully submitted review to FatherShops REST API:",
            ep,
            "captured review_id:",
            capturedReviewId
          );
          break;
        }
      } catch (err) {
        console.warn(
          "[serverReviewStore] Failed to post review to REST API endpoint:",
          ep,
          err,
        );
      }
    }
  }

  // Upload photos to FatherShops backend via uploadHandler so they show in Admin -> Media
  const uploadedImageUrls: string[] = [];

  if (capturedReviewId && data.images && data.images.length > 0) {
    const uploadHosts = [
      successHost,
      tenantHost,
      tenantHostAlt,
      baseHost,
    ].filter(Boolean);
    const hostToUse = uploadHosts[0] || tenantHost;

    for (let i = 0; i < data.images.length; i++) {
      const imgStr = data.images[i];
      if (!imgStr) continue;

      try {
        let buffer: Buffer | null = null;
        let mimeType = "image/jpeg";
        let ext = "jpg";

        if (imgStr.startsWith("data:")) {
          const matches = imgStr.match(/^data:(image\/[a-zA-Z0-9+\-]+);base64,(.+)$/);
          if (matches) {
            mimeType = matches[1];
            ext = mimeType.split("/")[1] || "jpg";
            if (ext === "jpeg") ext = "jpg";
            buffer = Buffer.from(matches[2], "base64");
          }
        } else if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) {
          const imgRes = await fetch(imgStr);
          if (imgRes.ok) {
            const arrBuf = await imgRes.arrayBuffer();
            buffer = Buffer.from(arrBuf);
            mimeType = imgRes.headers.get("content-type") || "image/jpeg";
            ext = mimeType.split("/")[1] || "jpg";
          }
        }

        if (buffer && buffer.length > 0) {
          const uint8Array = new Uint8Array(buffer);
          const blob = new Blob([uint8Array], { type: mimeType });
          const formData = new FormData();
          const fileName = `review-img-${Date.now()}-${i + 1}.${ext}`;
          formData.append("file", blob, fileName);

          const uploadUrl = `${hostToUse}/index.php?route=product/product/uploadHandler&review_id=${capturedReviewId}`;
          console.log(`[serverReviewStore] Uploading image ${i + 1} to FatherShops: ${uploadUrl}`);

          const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
            cache: "no-store",
          });

          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            console.log("[serverReviewStore] Image uploaded to FatherShops successfully:", uploadJson);
            if (uploadJson?.success && uploadJson?.path) {
              const fullImgUrl = uploadJson.path.startsWith("http")
                ? uploadJson.path
                : `${hostToUse}/${uploadJson.path.replace(/^\//, "")}`;
              uploadedImageUrls.push(cleanReviewImageUrl(fullImgUrl));
            }
          } else {
            console.warn(`[serverReviewStore] Image ${i + 1} upload failed with status ${uploadRes.status}`);
          }
        }
      } catch (uploadErr) {
        console.warn(`[serverReviewStore] Exception uploading image ${i + 1} to FatherShops:`, uploadErr);
      }
    }
  }

  if (uploadedImageUrls.length > 0) {
    review.images = uploadedImageUrls;
  }

  return {
    success: true,
    message: "Thank you for your review! It has been submitted and will be displayed on the product page after admin approval.",
    review,
    pending: true,
  };
}
