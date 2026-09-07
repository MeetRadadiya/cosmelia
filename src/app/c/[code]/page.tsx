"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { checkoutService } from "@/lib/fathershops/services/checkoutService";
import { useCart } from "@/lib/context/CartContext";

export default function SharedCartPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;
  const { cart } = useCart();
  const [status, setStatus] = useState<string>("Restoring your shared cart reservation...");

  useEffect(() => {
    let active = true;

    async function restoreSharedCart() {
      if (!code) return;

      try {
        setStatus("Resolving secure shared cart token...");
        await checkoutService.fetchByToken(code);

        if (active) {
          setStatus("Cart synchronized. Proceeding to checkout...");
          // Redirect to checkout with restored checkout token
          router.replace(`/checkout?checkout_token=${encodeURIComponent(code)}`);
        }
      } catch (err: any) {
        console.error("Failed to restore shared cart:", err);
        if (active) {
          setStatus("Redirecting to shopping bag...");
          router.replace("/cart");
        }
      }
    }

    restoreSharedCart();

    return () => {
      active = false;
    };
  }, [code, router]);

  return (
    <div className="py-24 bg-[#FAF9F6] min-h-screen flex items-center justify-center">
      <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#8C734B] border-t-transparent animate-spin mx-auto" />
        <h2 className="font-serif text-lg text-[#141416]">FatherShops Cart Handoff</h2>
        <p className="text-xs text-[#5E6472]">{status}</p>
      </div>
    </div>
  );
}
