import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center">
      <div className="luxury-container max-w-md text-center space-y-6 bg-white border border-[#EAE8E1] rounded-sm p-10 shadow-sm">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Error 404
        </span>
        <h1 className="text-3xl font-serif text-[#141416]">Modality Not Found</h1>
        <p className="text-xs text-[#5E6472] leading-relaxed">
          The formulation, product, or clinical page you are looking for has been moved or archived in our formulation registry.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md">
              Return To Storefront
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
