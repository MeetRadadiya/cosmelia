"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "@/lib/context/AccountContext";
import { useLocale } from "@/lib/context/LocaleContext";
import { formatPrice } from "@/lib/utils/format";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { EmptyState } from "@/components/account/EmptyState";
import { normalizeProduct } from "@/lib/fathershops/mappers";
import type { Product } from "@/lib/commerce/types";

export default function WishlistPage() {
  const { getWishlist, toggleWishlist } = useAccount();
  const { formatCurrencyAmount } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    getWishlist()
      .then((data) => {
        const rawProducts = data?.products || [];
        setProducts(rawProducts.map(normalizeProduct));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [getWishlist]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (productId: string) => {
    // Optimistic remove
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await toggleWishlist(productId);
    } catch {
      // Revert on error
      load();
    }
  };

  return (
    <AccountLayout title="Wishlist" breadcrumbLabel="Wishlist">
      <AccountCard>
        <AccountCardHeader title={`Saved for Later (${products.length})`} />
        <AccountCardBody>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-64 bg-[#FAF9F6] animate-pulse rounded" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="♡"
              title="Your wishlist is empty"
              description="Save your favorite beauty tools and self-care essentials here while you shop."
              action={{ label: "Discover The Collection", href: "/products" }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#EAE8E1] rounded-sm p-4 hover:border-[#8C734B] transition-colors"
                >
                  <div className="flex gap-4">
                    <Link href={`/product/${product.slug}`} className="relative w-24 h-24 bg-[#FAF9F6] rounded-sm overflow-hidden border border-[#EAE8E1] flex-shrink-0">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8C734B]/50">✦</div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/product/${product.slug}`}
                        className="block text-xs font-medium text-[#141416] hover:text-[#8C734B] transition-colors leading-snug"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm font-semibold text-[#141416]">
                        {formatCurrencyAmount(product.price)}
                        {product.compareAtPrice && (
                          <span className="ml-2 text-xs text-[#8B92A2] line-through font-normal">
                            {formatCurrencyAmount(product.compareAtPrice)}
                          </span>
                        )}
                      </p>
                      <div className="pt-2 flex gap-2 flex-wrap">
                        <Link href={`/product/${product.slug}`}>
                          <button className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-colors">
                            View & Add
                          </button>
                        </Link>
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border border-[#EAE8E1] text-[#5E6472] rounded-sm hover:border-[#B83A3A] hover:text-[#B83A3A] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccountCardBody>
      </AccountCard>
    </AccountLayout>
  );
}