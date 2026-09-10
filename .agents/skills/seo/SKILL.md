---
name: seo
description: Guidelines and best practices for Search Engine Optimization (SEO) in Next.js e-commerce applications, including Metadata API, JSON-LD structured data, Open Graph tags, canonical URLs, semantic HTML, sitemaps, and Core Web Vitals optimization.
---

# Search Engine Optimization (SEO) Skill Guide

This skill provides comprehensive instructions for implementing and maintaining technical and content SEO across Next.js and React web applications.

---

## 1. Metadata Management (Next.js App Router)

### Page-level Metadata (`generateMetadata` & `metadata`)
Every page should define dynamic or static metadata using Next.js Metadata API.

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Cosmelia",
      description: "The requested product could not be located.",
    };
  }

  const title = `${product.name} | Cosmelia`;
  const description = product.shortDescription || product.description?.slice(0, 160) || "";
  const canonicalUrl = `https://getcosmelia.com/product/${product.slug}`;
  const mainImage = product.thumbnail || product.images?.[0] || "";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Cosmelia",
      images: mainImage ? [{ url: mainImage, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}
```

---

## 2. Structured Data (JSON-LD Schemas)

Implement Schema.org JSON-LD microdata for rich search results (Google Rich Snippets).

### Product Schema
Embed on product details pages (`/product/[slug]`):

```tsx
export function ProductJsonLd({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [product.thumbnail],
    description: product.shortDescription || product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Cosmelia",
    },
    offers: {
      "@type": "Offer",
      url: `https://getcosmelia.com/product/${product.slug}`,
      priceCurrency: product.currency || "USD",
      price: product.price,
      availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Cosmelia",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Organization & WebSite Schema
Embed on the root layout or homepage:

```tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cosmelia",
  url: "https://getcosmelia.com",
  logo: "https://getcosmelia.com/icon.svg",
  sameAs: [
    "https://instagram.com",
    "https://pinterest.com",
  ],
};
```

---

## 3. On-Page SEO & HTML Semantics

1. **Heading Hierarchy**: Exactly one `<h1>` per page. Subheadings follow strict hierarchy (`<h2>` -> `<h3>` -> `<h4>`).
2. **Image Optimization**:
   - Always include descriptive `alt` text on `<img>` or Next.js `<Image>` tags.
   - Use proper aspect ratios to avoid Cumulative Layout Shift (CLS).
3. **Semantic Tags**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` elements.
4. **Descriptive Link Text**: Avoid generic links like "click here"; use keyword-rich anchor text.

---

## 4. Crawlability & Indexing

- **Dynamic Sitemap (`sitemap.ts`)**: Auto-generate sitemaps listing all active products, categories, and static pages.
- **Robots Config (`robots.ts`)**: Ensure public routes are indexable while disallowing private routes (`/checkout`, `/account/*`).

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/checkout/", "/cart"],
    },
    sitemap: "https://getcosmelia.com/sitemap.xml",
  };
}
```

---

## 5. Performance & Core Web Vitals (SEO Ranking Signals)

- **Largest Contentful Paint (LCP)**: Optimize hero images with priority loading (`priority` / preload).
- **First Input Delay (FID) / Interaction to Next Paint (INP)**: Keep client JavaScript bundles lightweight.
- **Cumulative Layout Shift (CLS)**: Reserve width/height space for image containers and dynamic components.
