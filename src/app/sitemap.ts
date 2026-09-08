import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getCommerceProvider } from "@/lib/commerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const commerce = getCommerceProvider();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/privacy",
    "/terms",
    "/shipping",
    "/returns",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      commerce.getProducts({ limit: 100 }),
      commerce.getCategories(),
    ]);
    productRoutes = products.products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));
    categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Static routes are still emitted even if the live catalog is unavailable
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
