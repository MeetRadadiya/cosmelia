import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url || "https://getcosmelia.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/checkout/",
          "/cart",
          "/c/",
          "/*?*order_id=",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/account/", "/checkout/", "/cart", "/c/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
