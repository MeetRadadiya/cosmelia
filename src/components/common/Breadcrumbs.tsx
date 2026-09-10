'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const allItems = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? (item.href.startsWith('http') ? item.href : `https://cosmelia.com${item.href}`) : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`py-2.5 px-0 mb-4 overflow-x-auto no-scrollbar border-b border-[#EAE8E1]/80 ${className}`}
      >
        <ol className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-[#8B92A2] whitespace-nowrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={index} className="flex items-center space-x-2">
                {index > 0 && (
                  <span className="text-[#C5A059]/70 font-serif text-xs">/</span>
                )}
                {isLast || !item.href ? (
                  <span className="font-semibold text-[#141416] truncate max-w-[240px] sm:max-w-[360px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#8C734B] transition-colors font-medium"
                  >
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
