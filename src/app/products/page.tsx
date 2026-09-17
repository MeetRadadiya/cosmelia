import { Metadata } from "next";
import { getCommerceProvider } from "@/lib/commerce";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCatalogClient } from "@/components/catalog/ProductCatalogClient";

export const metadata: Metadata = {
  title: "All Products | Beauty Tools & Self-Care",
  description:
    "Explore our curated collection of beauty tools, cooling accessories, facial massagers, and self-care essentials.",
  alternates: {
    canonical: "https://getcosmelia.com/products",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: "featured" | "price-asc" | "price-desc" | "rating";
  }>;
}) {
  const { category, sort } = await searchParams;
  const commerce = getCommerceProvider();

  // Fetch products and categories concurrently
  const [productsResult, categories] = await Promise.all([
    commerce.getProducts({ limit: 100 }), // Load full catalog for instant live client filtering (no pagination)
    commerce.getCategories(),
  ]);

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Products" }]} />

        {/* Catalog Header */}
        <div className="py-8 border-b border-[#EAE8E1] space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            All Beauty Tools &amp; Self-Care
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-xl">
            Thoughtfully selected tools and accessories to complement your daily at-home beauty rituals.
          </p>
        </div>

        {/* Product Catalog with Searchable Category Dropdown, Live Search & Extra Filters (No Pagination) */}
        <div className="py-6">
          <ProductCatalogClient
            initialProducts={productsResult.products}
            categories={categories}
            initialCategory={category}
            initialSort={sort}
          />
        </div>
      </div>
    </div>
  );
}
