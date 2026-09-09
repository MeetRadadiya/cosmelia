"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useLocale } from "@/lib/context/LocaleContext";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

function CartItemImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F4EF] p-2 text-[#8C734B]/60">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill unoptimized sizes="96px" className="object-cover" onError={() => setError(true)} />
  );
}

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const { formatCurrencyAmount } = useLocale();
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoStatus(null);
    try {
      const res = await applyCoupon(promoCode.trim());
      setPromoStatus(res);
    } catch {
      setPromoStatus({ success: false, message: "Failed to apply coupon." });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const freeShippingRemaining = cart ? Math.max(0, cart.freeShippingThreshold - cart.subtotal) : 0;

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Shopping Bag" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">Your Selection</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">Shopping Bag</h1>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#EAE8E1] rounded-sm p-8 my-10 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8C734B] mx-auto">
              ✦
            </div>
            <h2 className="text-lg font-serif text-[#141416]">Your bag is currently empty</h2>
            <p className="text-xs text-[#5E6472]">
              Explore our curated beauty tools and self-care accessories to enhance your daily routine.
            </p>
            <Link href="/products" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Discover The Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping incentive notification */}
              <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm flex items-center justify-between">
                <div className="text-xs text-[#141416]">
                  {freeShippingRemaining === 0 ? (
                    <span className="text-[#2D5A43] font-semibold">
                      ✓ Complimentary express courier shipping unlocked!
                    </span>
                  ) : (
                    <>
                      Add <span className="font-semibold">{formatCurrencyAmount(freeShippingRemaining)}</span> more to receive
                      complimentary global delivery.
                    </>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white border border-[#EAE8E1] rounded-sm divide-y divide-[#EAE8E1]">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative w-24 h-24 bg-[#FAF9F6] rounded-sm overflow-hidden flex-shrink-0 border border-[#EAE8E1]">
                      <CartItemImage src={item.image} alt={item.name} />
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="text-sm font-serif font-medium text-[#141416] hover:text-[#8C734B] transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.variantTitle && <p className="text-xs text-[#5E6472]">Edition: {item.variantTitle}</p>}
                      <p className="text-xs font-medium text-[#141416] sm:hidden">{formatCurrencyAmount(item.price)}</p>
                    </div>

                    <div className="hidden sm:block text-xs font-semibold text-[#141416] px-4">
                      {formatCurrencyAmount(item.price)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="inline-flex items-center border border-[#EAE8E1] rounded-sm bg-[#FAF9F6]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-xs text-[#141416] hover:bg-[#EAE8E1]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#141416]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-xs text-[#141416] hover:bg-[#EAE8E1]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-[#141416] w-20 text-right">
                      {formatCurrencyAmount(item.price * item.quantity)}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#8B92A2] hover:text-red-600 p-2 transition-colors"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 space-y-6 sticky top-35">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#141416]">Order Summary</h3>

                <div className="space-y-3 text-xs border-b border-[#EAE8E1] pb-6">
                  <div className="flex justify-between text-[#5E6472]">
                    <span>Items Subtotal</span>
                    <span className="text-[#141416] font-medium">{formatCurrencyAmount(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#5E6472]">
                    <span>Shipping & Handling</span>
                    <span className="text-[#141416] font-medium">
                      {cart.shipping === 0 ? "Complimentary" : formatCurrencyAmount(cart.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5E6472]">
                    <span>Estimated Tax</span>
                    <span className="text-[#141416] font-medium">{formatCurrencyAmount(cart.tax)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-[#2D5A43] font-medium">
                      <span>Promo Savings</span>
                      <span>- {formatCurrencyAmount(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold text-[#141416] pt-3 border-t border-[#EAE8E1]">
                    <span>Estimated Total</span>
                    <span>{formatCurrencyAmount(cart.total)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promotion code"
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm uppercase tracking-wider text-[#141416] focus:outline-none focus:border-[#141416]"
                    />
                    <Button variant="secondary" size="sm" isLoading={isApplyingPromo} onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {promoStatus && (
                    <p className={`text-[11px] ${promoStatus.success ? "text-[#2D5A43]" : "text-[#B33A3A]"}`}>
                      {promoStatus.message}
                    </p>
                  )}
                </div>

                <Link href="/checkout" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed To Checkout
                  </Button>
                </Link>

                <p className="text-[10px] text-center text-[#8B92A2] tracking-wide">
                  🔒 Certified 256-Bit SSL Checkout • FatherShops Commerce Guard
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
