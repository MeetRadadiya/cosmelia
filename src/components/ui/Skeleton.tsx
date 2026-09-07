import React from "react";
import { cn } from "../../lib/utils/format";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-[#EAE8E1]/80 rounded-sm", className)} />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="aspect-square w-full" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
