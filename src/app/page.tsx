import { getCommerceProvider } from "@/lib/commerce";
import { defaultHomepageSections } from "@/lib/config/sections";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const commerce = getCommerceProvider();

  const [productsResult, categories] = await Promise.all([
    commerce.getProducts({ limit: 8 }),
    commerce.getCategories(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <SectionRenderer
        sections={defaultHomepageSections}
        products={productsResult.products}
        categories={categories}
      />
    </div>
  );
}
