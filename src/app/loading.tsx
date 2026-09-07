import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container space-y-8">
        <div className="h-8 w-64 bg-[#EAE8E1] animate-pulse rounded-sm" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
