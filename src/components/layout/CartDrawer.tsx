"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../lib/context/CartContext";
import { useLocale } from "../../lib/context/LocaleContext";
import { formatPrice } from "../../lib/utils/format";
import { Button } from "../ui/Button";

function DrawerItemImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = React.useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F4EF] p-1 text-[#8C734B]/60">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill unoptimized sizes="80px" className="object-cover" onError={() => setError(true)} />
  );
}

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, error, clearError } = useCart();
  const { formatCurrencyAmount } = useLocale();

  if (!isOpen) return null;

  const freeShippingLeft = cart ? Math.max(0, cart.freeShippingThreshold - cart.subtotal) : 0;
  const progressPercent = cart ? Math.min(100, Math.round((cart.subtotal / cart.freeShippingThreshold) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#EAE8E1]">
          {/* Header */}
          <div className="p-5 border-b border-[#EAE8E1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-[#141416]">Shopping Bag</h2>
              <span className="text-xs text-[#8B92A2]">({cart?.itemCount || 0})</span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#8B92A2] hover:text-[#141416] transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Error Banner */}
          {error && (
            <div className="px-5 py-2.5 bg-[#FDF2F2] border-b border-[#F8D7DA] flex items-center justify-between gap-2 text-xs text-[#721C24]">
              <span>{error}</span>
              <button onClick={clearError} className="text-[#721C24] hover:opacity-75 text-sm font-bold">×</button>
            </div>
          )}

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#EAE8E1]">
            <p className="text-[11px] text-[#141416] font-medium text-center">
              {freeShippingLeft === 0 ? (
                <span className="text-[#2D5A43] font-semibold">✓ You qualify for Complimentary Express Shipping!</span>
              ) : (
                <>
                  Add <span className="font-semibold">{formatCurrencyAmount(freeShippingLeft)}</span> more for Complimentary
                  Express Shipping
                </>
              )}
            </p>
            <div className="w-full bg-[#EAE8E1] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#C5A059] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8B92A2]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-[#5E6472]">Your shopping bag is currently empty.</p>
                <Button variant="outline" size="sm" onClick={closeCart}>
                  Explore Products
                </Button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#EAE8E1]/60">
                  <div className="relative w-20 h-20 bg-[#FAF9F6] rounded-sm overflow-hidden flex-shrink-0 border border-[#EAE8E1]">
                    <DrawerItemImage src={item.image} alt={item.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-[#141416] line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#8B92A2] hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      {item.variantTitle && <p className="text-[11px] text-[#8B92A2] mt-0.5">{item.variantTitle}</p>}
                      <p className="text-xs font-medium text-[#141416] mt-1">{formatCurrencyAmount(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-[#EAE8E1] rounded-sm bg-[#FAF9F6]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#141416] hover:bg-[#EAE8E1] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-[#141416]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#141416] hover:bg-[#EAE8E1] transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#141416]">
                        {formatCurrencyAmount(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Totals and Checkout CTA */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-[#EAE8E1] bg-[#FAF9F6] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5E6472]">
                  <span>Subtotal</span>
                  <span>{formatCurrencyAmount(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5E6472]">
                  <span>Estimated Shipping</span>
                  <span>{cart.shipping === 0 ? "Complimentary" : formatCurrencyAmount(cart.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#141416] pt-2 border-t border-[#EAE8E1]">
                  <span>Estimated Total</span>
                  <span>{formatCurrencyAmount(cart.total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/cart" onClick={closeCart} className="w-full">
                  <Button variant="secondary" size="md" className="w-full">
                    View Bag
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart} className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>

              <p className="text-[10px] text-center text-[#8B92A2] tracking-wide pt-1">
                🔒 Guaranteed 256-Bit Encrypted Commerce Session
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
