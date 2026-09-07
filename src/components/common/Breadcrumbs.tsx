import React from "react";
import Link from "next/link";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center space-x-2 text-xs text-[#5E6472] flex-wrap">
        <li>
          <Link href="/" className="hover:text-[#141416] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-[#8B92A2]">/</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[#141416] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#141416] font-medium truncate max-w-[200px] md:max-w-none">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
