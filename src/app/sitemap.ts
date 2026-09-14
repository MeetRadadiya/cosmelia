import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getCommerceProvider } from "@/lib/commerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url || "https://getcosmelia.com";
  const commerce = getCommerceProvider();

  // Public indexable static routes (excluding private routes like /cart, /checkout, /account)
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/categories",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/track-order",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/products" || route === "/categories" ? 0.9 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [productsResult, categories] = await Promise.all([
      commerce.getProducts({ limit: 100 }),
      commerce.getCategories(),
    ]);

    productRoutes = (productsResult?.products || []).map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    categoryRoutes = (categories || []).map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Static routes are emitted cleanly even if catalog provider is temporarily unreachable
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
