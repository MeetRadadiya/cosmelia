"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductVariant } from "../../lib/commerce/types";
import { formatPrice } from "../../lib/utils/format";
import { Button } from "../ui/Button";
import { useCart } from "../../lib/context/CartContext";
import { useAccount } from "../../lib/context/AccountContext";
import { useLocale } from "../../lib/context/LocaleContext";
import { trackEvent } from "../../lib/analytics";
import { SocialShare } from "./SocialShare";
import { NotifyMeModal } from "./NotifyMeModal";

export const ProductPurchaseSection: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, buyNow } = useCart();
  const { toggleWishlist } = useAccount();
  const { formatCurrencyAmount } = useLocale();

  useEffect(() => {
    trackEvent("view_item", {
      item_id: product.id,
      item_name: product.name,
      value: product.price,
      currency: product.currency || "USD",
    });
  }, [product.id, product.name, product.price, product.currency]);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = JSON.parse(localStorage.getItem("cosmelia_wishlist") || "[]");
      return Array.isArray(saved) && saved.includes(product.id);
    } catch {
      return false;
    }
  });

  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      trackEvent("add_to_wishlist", {
        item_id: product.id,
        item_name: product.name,
        value: product.price,
        currency: product.currency || "USD",
      });
    }
    try {
      const saved = JSON.parse(localStorage.getItem("cosmelia_wishlist") || "[]");
      const updated = nextState
        ? Array.from(new Set([...saved, product.id]))
        : saved.filter((id: string) => id !== product.id);
      localStorage.setItem("cosmelia_wishlist", JSON.stringify(updated));
    } catch {}

    try {
      await toggleWishlist(product.id);
    } catch {}
  };

  const minQty = parseInt(product.specifications?.["Minimum Order Quantity"] || "1", 10) || 1;
  const [quantity, setQuantity] = useState(minQty);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const [selectedOptionValues, setSelectedOptionValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    (product.options || []).forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.id] = opt.values[0].id;
      }
    });
    return initial;
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants[0]);

  const handleSelectOptionValue = (optId: string, val: (typeof product.options)[0]["values"][0]) => {
    const updated = { ...selectedOptionValues, [optId]: val.id };
    setSelectedOptionValues(updated);

    const matching = product.variants.find((v) => v.id === val.id || v.title === val.name);
    if (matching) {
      setSelectedVariant(matching);
    } else if (val.price !== undefined) {
      setSelectedVariant((prev) => (prev ? { ...prev, price: val.price!, title: val.name } : undefined));
    }
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAt = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      setIsNotifyOpen(true);
      return;
    }
    setIsAdding(true);
    await addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: currentPrice,
        compareAtPrice: currentCompareAt,
        thumbnail: selectedVariant?.image || product.thumbnail,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        selectedOptions: selectedOptionValues,
      },
      quantity,
    );
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      setIsNotifyOpen(true);
      return;
    }
    setIsBuying(true);
    await buyNow(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: currentPrice,
        compareAtPrice: currentCompareAt,
        thumbnail: selectedVariant?.image || product.thumbnail,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        selectedOptions: selectedOptionValues,
      },
      quantity,
    );
    setIsBuying(false);
  };

  return (
    <div className="space-y-6">
      {/* Price Display - Strictly dark text in light mode */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-semibold text-[#141416]">
          {formatCurrencyAmount(currentPrice)}
        </span>
        {currentCompareAt && currentCompareAt > currentPrice && (
          <span className="text-sm sm:text-base text-[#8B92A2] line-through">
            {formatCurrencyAmount(currentCompareAt)}
          </span>
        )}
        {!isOutOfStock ? (
          <span className="text-[11px] font-semibold text-[#2D5A43] uppercase tracking-wider bg-[#EBF1ED] px-2 py-0.5 rounded-[2px]">
            In Stock
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#B83A3A] uppercase tracking-wider bg-[#FAEEEE] px-2 py-0.5 rounded-[2px]">
            Out of Stock
          </span>
        )}
      </div>

      {/* Options Selector */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-4 pt-2">
          {product.options.map((opt) => {
            const selectedValId = selectedOptionValues[opt.id];
            const currentSelectedValue = opt.values.find((v) => v.id === selectedValId);

            return (
              <div key={opt.id} className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#141416] flex items-center justify-start gap-2">
                  <span>{opt.name}:</span>
                  <span className="font-normal text-[#5E6472]">
                    {currentSelectedValue?.name || selectedVariant?.title}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const isSelected = selectedValId === val.id;

                    return (
                      <button
                        key={val.id}
                        type="button"
                        onClick={() => handleSelectOptionValue(opt.id, val)}
                        className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-sm border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#141416] text-white border-[#141416] shadow-sm"
                            : "bg-white text-[#141416] border-[#EAE8E1] hover:border-[#141416]"
                        }`}
                      >
                        {val.image && (
                          <img
                            src={val.image}
                            alt={val.name}
                            className="w-5 h-5 rounded-xs object-cover flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <span>{val.name}</span>
                        {val.price !== undefined && val.price !== product.price && (
                          <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#8C734B]"}`}>
                            ({formatCurrencyAmount(val.price)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity & CTAs using official Button component styling */}
      <div className="pt-4 space-y-3">
        {!isOutOfStock ? (
          <>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#EAE8E1] rounded-sm bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                  className="px-3 py-3 text-sm text-[#141416] hover:bg-[#FAF9F6] transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-[#141416]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-3 text-sm text-[#141416] hover:bg-[#FAF9F6] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                isLoading={isAdding}
                onClick={handleAddToCart}
                className="flex-1 py-3.5"
              >
                Add to Bag • {formatCurrencyAmount(currentPrice * quantity)}
              </Button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-label="Wishlist button"
                className="p-3.5 border border-[#EAE8E1] rounded-sm bg-white hover:border-[#141416] transition-colors flex items-center justify-center text-[#141416]"
              >
                <svg
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? "fill-red-500 text-red-500" : "fill-none stroke-current hover:text-red-500"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Instant Checkout using official Button variant="outline" */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              isLoading={isBuying}
              onClick={handleBuyNow}
              className="w-full py-3.5"
            >
              Instant Checkout &rarr;
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setIsNotifyOpen(true)}
              className="w-full py-3.5 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Notify Me When Available</span>
            </Button>

            <button
              type="button"
              onClick={handleWishlistToggle}
              className="w-full py-2.5 border border-[#EAE8E1] rounded-sm text-xs font-semibold text-[#141416] hover:border-[#141416] transition-colors flex items-center justify-center gap-2"
            >
              <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist for Later"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Social Share Component */}
      <SocialShare title={product.name} />

      {/* Stock Notification Modal */}
      <NotifyMeModal
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        productName={product.name}
      />
    </div>
  );
};
