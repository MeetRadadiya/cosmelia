import { Metadata } from "next";
import { getCommerceProvider } from "@/lib/commerce";
import { ProductCard } from "@/components/common/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Clinical Formulations & Devices",
  description:
    "Explore our complete clinical collection of medical-grade LED phototherapy masks, microcurrent sculptors, bio-ferment peptide serums, and dissolving microneedles.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: "featured" | "price-asc" | "price-desc" | "rating" }>;
}) {
  const { category, sort } = await searchParams;
  const commerce = getCommerceProvider();

  const [productsResult, categories] = await Promise.all([
    commerce.getProducts({ categorySlug: category, sort, limit: 24 }),
    commerce.getCategories(),
  ]);

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Products" }]} />

        {/* Header */}
        <div className="py-8 border-b border-[#EAE8E1] space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            All Formulations & Instruments
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-xl">
            Every product adheres to strict biocompatibility, medical diode precision, and dermal lipid restoration standards.
          </p>
        </div>

        {/* Category Pills & Sorting Bar */}
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E1]">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors ${
                !category
                  ? "bg-[#141416] text-white border-[#141416]"
                  : "bg-white text-[#5E6472] border-[#EAE8E1] hover:border-[#141416]"
              }`}
            >
              All ({productsResult.total})
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors ${
                  category === c.slug
                    ? "bg-[#141416] text-white border-[#141416]"
                    : "bg-white text-[#5E6472] border-[#EAE8E1] hover:border-[#141416]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#5E6472]">
            <span>Showing {productsResult.products.length} products</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="py-10">
          {productsResult.products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-3">
              <p className="text-sm text-[#5E6472]">No products found matching your current selection.</p>
              <Link
                href="/products"
                className="inline-block text-xs uppercase tracking-wider font-semibold text-[#8C734B] hover:underline"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {productsResult.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
