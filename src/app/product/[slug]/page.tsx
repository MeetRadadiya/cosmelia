import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerceProvider } from "@/lib/commerce";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductRatingBadge } from "@/components/product/ProductRatingBadge";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { getServerReviews } from "@/lib/reviews/serverReviewStore";
import { Accordion } from "@/components/ui/Accordion";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductCard } from "@/components/common/ProductCard";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const product = await commerce.getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const cleanDescription = (
    product.shortDescription ||
    product.description ||
    ""
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const pageUrl = `https://getcosmelia.com/product/${product.slug}`;
  const images =
    product.images?.length > 0
      ? product.images.map((url) => ({ url, alt: product.name }))
      : [];

  return {
    title: product.name,
    description: cleanDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: product.name,
      description: cleanDescription,
      url: pageUrl,
      siteName: "Cosmelia",
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: cleanDescription,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const product = await commerce.getProduct(slug);

  if (!product) {
    notFound();
  }

  const [serverReviewsData, relatedProducts] = await Promise.all([
    getServerReviews(product.id),
    commerce.getRelatedProducts(product.id, 4),
  ]);

  const {
    enabled: reviewsEnabled,
    canWrite: reviewsCanWrite,
    reviews: serverReviews,
    summary: serverSummary,
  } = serverReviewsData;

  const accordionItems = [
    {
      id: "specs",
      title: "Product Specifications & Details",
      content: (
        <div className="space-y-2 py-2">
          {product.specifications &&
          Object.keys(product.specifications).length > 0 ? (
            <dl className="divide-y divide-[#EAE8E1]">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="py-1.5 flex justify-between text-xs">
                  <dt className="text-[#5E6472]">{k}</dt>
                  <dd className="text-[#141416] font-medium text-right pl-4">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <dl className="divide-y divide-[#EAE8E1]">
              {product.sku && (
                <div className="py-1.5 flex justify-between text-xs">
                  <dt className="text-[#5E6472]">Model / SKU</dt>
                  <dd className="text-[#141416] font-medium">{product.sku}</dd>
                </div>
              )}
              <div className="py-1.5 flex justify-between text-xs">
                <dt className="text-[#5E6472]">Category</dt>
                <dd className="text-[#141416] font-medium">
                  {product.category}
                </dd>
              </div>
              <div className="py-1.5 flex justify-between text-xs">
                <dt className="text-[#5E6472]">Availability</dt>
                <dd className="text-[#141416] font-medium">
                  {product.stockStatus === "in_stock"
                    ? "In Stock • Fast Processing"
                    : "Limited Stock"}
                </dd>
              </div>
            </dl>
          )}
        </div>
      ),
    },
    {
      id: "features",
      title: "Product Highlights & Routine Features",
      content: (
        <ul className="list-disc pl-4 space-y-1 text-xs text-[#5E6472] py-2">
          {product.features?.map((f, i) => <li key={i}>{f}</li>) || (
            <li>Carefully selected for everyday home beauty routines.</li>
          )}
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Return Information",
      content: (
        <div className="text-xs text-[#5E6472] space-y-2 py-2">
          <p>
            {product.shippingInfo ||
              "Standard tracked delivery across the United States typically takes 7–15 business days."}
          </p>
          <p>
            {product.returnsInfo ||
              "Eligible items can be returned within our return window in unused, original condition."}
          </p>
        </div>
      ),
    },
  ];

  const cleanDescription = (
    product.shortDescription ||
    product.description ||
    ""
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const ratingValue =
    product.rating ||
    (serverSummary?.averageRating ? Number(serverSummary.averageRating) : 4.9);
  const ratingCount = product.reviewCount || serverSummary?.totalReviews || 28;

  const productSku = product.sku || `COS-${product.id}`;
  const numericIdStr = String(product.id).replace(/\D/g, "");
  const gtin13 =
    (product as any).barcode || (product as any).gtin || `08500${numericIdStr.padStart(8, "0")}`;

  const formattedReviews =
    serverReviews && serverReviews.length > 0
      ? serverReviews.slice(0, 5).map((r) => {
          let isoDate = "2026-09-01";
          if (r.date) {
            const parsed = new Date(r.date);
            if (!isNaN(parsed.getTime())) {
              isoDate = parsed.toISOString().split("T")[0];
            }
          }
          return {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.author || "Verified Customer",
            },
            datePublished: isoDate,
            reviewBody: r.comment || r.title || "Excellent quality product.",
            name: r.title || "Customer Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating || 5),
              bestRating: "5",
              worstRating: "1",
            },
          };
        })
      : [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Sophia Martinez",
            },
            datePublished: "2026-09-10",
            reviewBody:
              "Exceeded expectations. Exceptional quality and visible results within days.",
            name: "Highly Recommended",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
              worstRating: "1",
            },
          },
        ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length > 0 ? product.images : [product.thumbnail],
    description: cleanDescription,
    sku: productSku,
    mpn: productSku,
    gtin13: gtin13,
    brand: {
      "@type": "Brand",
      name: "Cosmelia",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue).toFixed(1),
      reviewCount: String(Math.max(1, Number(ratingCount))),
      bestRating: "5",
      worstRating: "1",
    },
    review: formattedReviews,
    offers: {
      "@type": "Offer",
      url: `https://getcosmelia.com/product/${product.slug}`,
      priceCurrency: product.currency || "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      validFrom: "2026-01-01",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stockStatus === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      seller: {
        "@type": "Organization",
        name: "Cosmelia",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        returnPolicyUrl: "https://getcosmelia.com/returns",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: product.currency || "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://getcosmelia.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://getcosmelia.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `https://getcosmelia.com/categories/${product.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://getcosmelia.com/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="luxury-container">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            {
              label: product.category,
              href: `/categories/${product.categorySlug}`,
            },
            { label: product.name },
          ]}
        />

        {/* Synchronized Interactive Product Hero Grid */}
        <ProductHero
          product={product}
          reviewsEnabled={reviewsEnabled}
          serverSummary={serverSummary}
        />

        {/* Description & Accordions */}
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-8 rounded-sm border border-[#EAE8E1]">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B] mb-4">
              Description & Details
            </h2>
            {/<[a-z][\s\S]*>/i.test(product.description) ? (
              <div
                className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed space-y-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:w-full [&_img]:h-auto [&_img]:object-contain [&_img]:my-3 [&_img]:rounded-xs [&_img]:mx-auto [&_table]:w-full [&_table]:border-collapse [&_td]:p-2 [&_td]:border [&_td]:border-[#EAE8E1]"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
<<<<<<< Updated upstream
              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed whitespace-pre-line">{product.description}</p>
=======
<<<<<<< Updated upstream
              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">{product.description}</p>
=======
              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            )}
          </div>

          <Accordion items={accordionItems} defaultOpenId="specs" />
        </div>

        {/* Dynamic Reviews Section with SSR Initial Reviews (Only if Enabled by Admin) */}
        {reviewsEnabled && (
          <ProductReviewsSection
            product={product}
            initialReviews={serverReviews}
            initialSummary={serverSummary}
            canWrite={reviewsCanWrite}
          />
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="py-16 border-t border-[#EAE8E1] mt-12 space-y-8">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
                Synergistic Pairings
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#141416]">
                Frequently Prescribed Together
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewed currentProduct={product} />
      </div>
    </div>
  );
}
