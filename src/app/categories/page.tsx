import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCommerceProvider } from "@/lib/commerce";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Clinical Modalities & Collections",
  description:
    "Explore our complete range of clinical skincare modalities: LED phototherapy face masks, sonic lifting massagers, cryo ice rollers, and hydrocolloid patches.",
};

interface ModalityCard {
  title: string;
  slug: string;
  badge: string;
  description: string;
  image: string;
}

const MODALITY_DETAILS: Record<string, { badge: string; description: string; image: string }> = {
  "30": {
    badge: "Phototherapy",
    description: "Multi-wavelength 7-color medical LED photobiomodulation for cellular vitality and collagen synthesis.",
    image: "https://cdn.fathershops.com/f-images/catalog/1005005484832355/product_image_aesa_1005005484832355.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  "31": {
    badge: "Microcurrent & Sculpting",
    description: "High-frequency sonic vibration and thermal contouring instruments for jawline and neck definition.",
    image: "https://cdn.fathershops.com/f-images/catalog/1005007170717983/product_image_aesa_1005007170717983.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  "24": {
    badge: "Cryotherapy",
    description: "Sub-zero ice globes and gua sha cooling instruments for lymphatic drainage and puffiness relief.",
    image: "https://cdn.fathershops.com/f-images/catalog/1005012546280812/product_image_aesa_1005012546280812.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  "21": {
    badge: "Blemish Clarification",
    description: "Hydrocolloid ultra-thin invisible stickers and star spot covers for fast overnight acne extraction.",
    image: "https://cdn.fathershops.com/f-images/catalog/1005012202383892/product_image_aesa_1005012202383892.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  "22": {
    badge: "Under-Eye Revitalization",
    description: "Golden crystal collagen gel patches and soothing eye stickers targeting fine lines and dark circles.",
    image: "https://cdn.fathershops.com/f-images/catalog/1005010499076578/product_image_aesa_1005010499076578.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
};

export default async function CategoriesIndexPage() {
  const commerce = getCommerceProvider();
  const rawCategories = await commerce.getCategories();

  // Filter only active consumer categories (exclude dropship or empty categories)
  const activeIds = ["30", "31", "24", "21", "22"];
  const categories = rawCategories
    .filter((c) => activeIds.includes(String(c.id)))
    .sort((a, b) => activeIds.indexOf(String(a.id)) - activeIds.indexOf(String(b.id)));

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Modalities & Categories" }]} />

        {/* Header Section */}
        <div className="py-8 border-b border-[#EAE8E1] space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Clinical Modalities
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            Targeted Skincare Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6472] font-light max-w-xl">
            Explore our curated collections by treatment protocol — from medical-grade LED phototherapy to thermal sculpting massagers and hydrocolloid transdermal patches.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const meta = MODALITY_DETAILS[category.id] || {
              badge: "Clinical Modality",
              description: category.description,
              image: category.image,
            };

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative bg-white border border-[#EAE8E1] rounded-sm overflow-hidden flex flex-col hover:border-[#8C734B]/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full bg-[#FAF9F6] overflow-hidden">
                  <Image
                    src={meta.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#141416] text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-[2px]">
                    {meta.badge}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-serif text-[#141416] group-hover:text-[#8C734B] transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-xs text-[#5E6472] font-light leading-relaxed line-clamp-2">
                      {meta.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE8E1]/60 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8C734B] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                      Explore Collection &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="py-8 bg-white border border-[#EAE8E1] rounded-sm p-8 text-center space-y-3">
          <h3 className="font-serif text-xl text-[#141416]">
            Looking for all instruments & treatments?
          </h3>
          <p className="text-xs text-[#5E6472] max-w-md mx-auto">
            Browse our complete catalog with advanced filtering by modality, concern, and clinical rating.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#141416] text-[#FAF9F6] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm hover:bg-[#8C734B] transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
