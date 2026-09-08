import { getCommerceProvider } from "@/lib/commerce";
import { defaultHomepageSections } from "@/lib/config/sections";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const commerce = getCommerceProvider();

  const [productsResult, categories] = await Promise.all([
    commerce.getProducts({ limit: 30 }),
    commerce.getCategories(),
  ]);

  // Dynamically attach a representative product thumbnail image for each category card
  const categoriesWithProductImages = categories.map((cat) => {
    const matchingProduct = productsResult.products.find(
      (p) =>
        p.categoryId === cat.id ||
        p.categorySlug === cat.slug ||
        p.category.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(p.category.toLowerCase())
    );

    const image =
      matchingProduct?.thumbnail ||
      matchingProduct?.hoverImage ||
      cat.image;

    return {
      ...cat,
      image,
    };
  });

  return (
    <div className="flex flex-col w-full">
      <SectionRenderer
        sections={defaultHomepageSections}
        products={productsResult.products.slice(0, 8)}
        categories={categoriesWithProductImages}
      />
    </div>
  );
}
