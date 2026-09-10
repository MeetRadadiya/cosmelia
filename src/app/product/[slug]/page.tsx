import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerceProvider } from "@/lib/commerce";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductRatingBadge } from "@/components/product/ProductRatingBadge";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { getServerReviews } from "@/lib/reviews/serverReviewStore";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchaseSection } from "@/components/product/ProductPurchaseSection";
import { ProductCard } from "@/components/common/ProductCard";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const product = await commerce.getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const cleanDescription = (product.shortDescription || product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const pageUrl = `https://getcosmelia.com/product/${product.slug}`;
  const images = product.images?.length > 0 ? product.images.map((url) => ({ url, alt: product.name })) : [];

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
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <dl className="divide-y divide-[#EAE8E1]">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="py-1.5 flex justify-between text-xs">
                  <dt className="text-[#5E6472]">{k}</dt>
                  <dd className="text-[#141416] font-medium text-right pl-4">{v}</dd>
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
                <dd className="text-[#141416] font-medium">{product.category}</dd>
              </div>
              <div className="py-1.5 flex justify-between text-xs">
                <dt className="text-[#5E6472]">Availability</dt>
                <dd className="text-[#141416] font-medium">
                  {product.stockStatus === "in_stock" ? "In Stock • Fast Processing" : "Limited Stock"}
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
          {product.features?.map((f, i) => <li key={i}>{f}</li>) || <li>Carefully selected for everyday home beauty routines.</li>}
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Return Information",
      content: (
        <div className="text-xs text-[#5E6472] space-y-2 py-2">
          <p>{product.shippingInfo || "Standard tracked delivery across the United States typically takes 7–15 business days."}</p>
          <p>{product.returnsInfo || "Eligible items can be returned within our return window in unused, original condition."}</p>
        </div>
      ),
    },
  ];

  const cleanDescription = (product.shortDescription || product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length > 0 ? product.images : [product.thumbnail],
    description: cleanDescription,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Cosmelia",
    },
    offers: {
      "@type": "Offer",
      url: `https://getcosmelia.com/product/${product.slug}`,
      priceCurrency: product.currency || "USD",
      price: product.price,
      availability: product.stockStatus === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      seller: {
        "@type": "Organization",
        name: "Cosmelia",
      },
    },
  };

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="luxury-container">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: product.category, href: `/categories/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-8">
          {/* Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Product Purchasing & Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2 border-b border-[#EAE8E1] pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
                  {product.category}
                </span>
                {reviewsEnabled && (
                  <ProductRatingBadge
                    product={product}
                    initialRating={serverSummary.averageRating}
                    initialReviewCount={serverSummary.totalReviews}
                    size="md"
                  />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#141416] leading-tight">{product.name}</h1>
              {product.tagline && (
                <p className="text-xs text-[#8C734B] font-medium tracking-wide">✦ {product.tagline}</p>
              )}
            </div>

            {/* Interactive Buy Box */}
            <ProductPurchaseSection product={product} />
          </div>
        </div>

        {/* Description & Accordions */}
        <div className="space-y-4">
          <div className="bg-white p-5">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">Description</div>
            {/<[a-z][\s\S]*>/i.test(product.description) ? (
              <div
                className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed space-y-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_img]:max-w-full [&_img]:rounded-sm overflow-hidden"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">{product.description}</p>
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
              <h2 className="text-xl sm:text-2xl font-serif text-[#141416]">Frequently Prescribed Together</h2>
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

