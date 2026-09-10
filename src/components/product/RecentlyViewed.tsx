'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../../lib/commerce/types';
import { ProductCard } from '../common/ProductCard';

interface RecentlyViewedProps {
  currentProduct?: Product;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProduct }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('cosmelia_recently_viewed');
      let list: Product[] = stored ? JSON.parse(stored) : [];

      if (currentProduct) {
        list = [currentProduct, ...list.filter((p) => p.id !== currentProduct.id)].slice(0, 8);
        localStorage.setItem('cosmelia_recently_viewed', JSON.stringify(list));
      }

      const displayList = currentProduct ? list.filter((p) => p.id !== currentProduct.id) : list;
      setItems(displayList);
    } catch {}
  }, [currentProduct]);

  if (items.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#EAE8E1] mt-12 space-y-6">
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Your Browsing History
        </span>
        <h2 className="text-xl sm:text-2xl font-serif text-[#141416]">Recently Viewed</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
};
