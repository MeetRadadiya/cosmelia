export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#x3A;/gi, ":")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#x3F;/gi, "?")
    .replace(/&#x3D;/gi, "=")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

export function cleanReviewImageUrl(url: string): string {
  if (!url) return "";
  let cleanUrl = decodeHtmlEntities(url.trim());
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch {}
  cleanUrl = decodeHtmlEntities(cleanUrl);

  // Normalize thumbnail URLs to prevent duplicate query-parameter variants
  if (
    cleanUrl.includes("/catalog/") ||
    cleanUrl.includes("cdn.fathershops.com") ||
    cleanUrl.includes(".myfathershops.com")
  ) {
    const baseUrl = cleanUrl.split("?")[0];
    return `${baseUrl}?origin=sites&width=150&height=150&aspect_ratio=1:1`;
  }
  return cleanUrl;
}

export function getReviewFullImageUrl(url: string): string {
  if (!url) return "";
  let cleanUrl = decodeHtmlEntities(url.trim());
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch {}
  cleanUrl = decodeHtmlEntities(cleanUrl);

  // Returns full high-resolution original image for Lightbox preview
  if (
    cleanUrl.includes("/catalog/") ||
    cleanUrl.includes("cdn.fathershops.com") ||
    cleanUrl.includes(".myfathershops.com")
  ) {
    return cleanUrl.split("?")[0];
  }
  return cleanUrl;
}
