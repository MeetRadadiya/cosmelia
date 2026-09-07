/**
 * Centralized FatherShops API Configuration.
 * 
 * Sources configuration strictly from environment variables.
 * Default values match the official OpenAPI specification.
 */

export interface FatherShopsConfig {
  apiBaseUrl: string;
  tenant: string;
  platform: "fathershops" | "sociify";
  domain?: string;
  accessToken?: string;
  sessionId?: string;
  isConfigured: boolean;
}

export function getFatherShopsConfig(): FatherShopsConfig {
  const apiBaseUrl =
    process.env.FATHERSHOP_API_BASE_URL ||
    process.env.NEXT_PUBLIC_FATHERSHOP_API_BASE_URL ||
    process.env.FATHERSHOPS_API_URL ||
    "https://api-front.myfathershops.com/api/";

  const tenant =
    process.env.FATHERSHOP_TENANT ||
    process.env.NEXT_PUBLIC_FATHERSHOP_TENANT ||
    process.env.FATHERSHOPS_STORE_ID ||
    "getcosmelia";

  const platformRaw = (
    process.env.FATHERSHOP_PLATFORM ||
    process.env.NEXT_PUBLIC_FATHERSHOP_PLATFORM ||
    "fathershops"
  ).toLowerCase();

  const platform: "fathershops" | "sociify" =
    platformRaw === "sociify" ? "sociify" : "fathershops";

  const domain =
    process.env.FATHERSHOP_DOMAIN ||
    process.env.NEXT_PUBLIC_FATHERSHOP_DOMAIN ||
    "getcosmelia.com";

  const accessToken =
    process.env.FATHERSHOP_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_FATHERSHOP_ACCESS_TOKEN ||
    process.env.FATHERSHOPS_API_KEY ||
    undefined;

  const sessionId =
    process.env.FATHERSHOP_SESSION_ID ||
    process.env.NEXT_PUBLIC_FATHERSHOP_SESSION_ID ||
    undefined;

  const isConfigured = Boolean(apiBaseUrl && tenant);

  return {
    apiBaseUrl: apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`,
    tenant,
    platform,
    domain,
    accessToken,
    sessionId,
    isConfigured,
  };
}
