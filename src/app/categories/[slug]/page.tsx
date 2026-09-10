import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerceProvider } from "@/lib/commerce";
import { ProductCard } from "@/components/common/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const category = await commerce.getCategory(slug);

  if (!category) {
    return { title: "Category Not Found | Cosmelia" };
  }

  const pageUrl = `https://getcosmelia.com/categories/${category.slug}`;
  const title = `${category.name} | Beauty Tools & Self-Care`;
  const description = category.description || `Explore ${category.name} beauty tools and self-care accessories at Cosmelia.`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Cosmelia",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const commerce = getCommerceProvider();

  const [category, productsResult] = await Promise.all([
    commerce.getCategory(slug),
    commerce.getProducts({ categorySlug: slug }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/products" },
            { label: category.name },
          ]}
        />

        <div className="py-8 border-b border-[#EAE8E1] space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Curated Category
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-xl">
            {category.description}
          </p>
        </div>

        <div className="py-10">
          {productsResult.products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-2">
              <p className="text-sm text-[#5E6472]">No products currently listed in this category.</p>
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
