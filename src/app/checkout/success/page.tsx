"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { checkoutService } from "@/lib/fathershops/services/checkoutService";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useLocale } from "@/lib/context/LocaleContext";
import { formatPrice } from "@/lib/utils/format";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("id") || "";
  const { formatCurrencyAmount } = useLocale();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    let active = true;

    async function loadSuccessDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await checkoutService.getOrderSuccess(orderId);
        if (active && res.data && !Array.isArray(res.data)) {
          setOrderData(res.data);
        }
      } catch (err) {
        console.warn("[CheckoutSuccess] Failed to load detailed order receipt:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSuccessDetails();

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-2xl">
        <Breadcrumbs items={[{ label: "Checkout", href: "/checkout" }, { label: "Order Confirmed" }]} />

        <div className="mt-8 bg-white border border-[#EAE8E1] rounded-sm p-8 sm:p-12 text-center space-y-6 shadow-xs">
          {/* Status Badge Icon */}
          <div className="w-16 h-16 rounded-full bg-[#EBF1ED] text-[#2D5A43] flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Order Confirmed • Cosmelia
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">Thank You For Your Order</h1>
            {orderId && (
              <p className="text-xs text-[#8B92A2] font-mono tracking-wider">
                ORDER REFERENCE #{orderId}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#5E6472] max-w-md mx-auto leading-relaxed">
            Your order has been successfully confirmed and is now being processed for fulfillment. A
            detailed tracking notification will be emailed to you as soon as your package ships.
          </p>

          {/* Detailed Order Snapshot if returned by FatherShops */}
          {orderData && (
            <div className="pt-6 border-t border-[#EAE8E1] text-left space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#141416]">Order Summary</h3>

              {orderData.products && Array.isArray(orderData.products) && (
                <div className="divide-y divide-[#EAE8E1] border-y border-[#EAE8E1]">
                  {orderData.products.map((p: any, idx: number) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-medium text-[#141416]">{p.name}</p>
                        <p className="text-[11px] text-[#8B92A2]">Qty: {p.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#141416]">{p.total ? formatCurrencyAmount(p.total) : ""}</span>
                    </div>
                  ))}
                </div>
              )}

              {orderData.totals && Array.isArray(orderData.totals) && (
                <div className="space-y-1 text-xs pt-2">
                  {orderData.totals.map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[#5E6472]">
                      <span>{t.title}</span>
                      <span className="font-medium text-[#141416]">{t.text || formatCurrencyAmount(t.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-[#EAE8E1] flex flex-col sm:flex-row items-center justify-center gap-3">
            {orderId && (
              <Link href={`/account/track?tracking_code=${encodeURIComponent(orderId)}`}>
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  Track Shipment
                </Button>
              </Link>
            )}
            <Link href="/products">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <p className="text-[10px] text-[#8B92A2] tracking-wider uppercase pt-4">
            🔒 256-Bit Encrypted & Verified by FatherShops Core Commerce
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 bg-[#FAF9F6] min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#8C734B] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
