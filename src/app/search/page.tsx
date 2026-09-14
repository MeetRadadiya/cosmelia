import React from "react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SearchView } from "@/components/search/SearchView";

export const metadata: Metadata = {
  title: "Search Beauty & Skincare Catalog | Cosmelia",
  description:
    "Search Cosmelia luxury skincare tools, hydrocolloid pimple patches, micro-dart eye patches, LED facial masks, and beauty tools.",
  alternates: {
    canonical: "https://getcosmelia.com/search",
  },
  openGraph: {
    title: "Search Catalog | Cosmelia Luxury Skincare",
    description:
      "Explore Cosmelia luxury beauty tools, patches, and skincare essentials.",
    url: "https://getcosmelia.com/search",
    siteName: "Cosmelia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Catalog | Cosmelia",
    description:
      "Explore Cosmelia luxury beauty tools, patches, and skincare essentials.",
  },
};

export default function SearchPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Search Catalog" }]} />
        <SearchView />
      </div>
    </div>
  );
}
