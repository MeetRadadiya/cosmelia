"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart, CartItem } from "../commerce/types";
import { trackEvent } from "../analytics";
import { cartService } from "../fathershops/services/cartService";
import { catalogService } from "../fathershops/services/catalogService";
import { normalizeCart } from "../fathershops/mappers";
import { fathershopsClient } from "../fathershops/client";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
  addItem: (
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      thumbnail: string;
      variantId?: string;
      variantTitle?: string;
      selectedOptions?: Record<string, any>;
    },
    quantity?: number
  ) => Promise<boolean>;
  buyNow: (
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      thumbnail: string;
      variantId?: string;
      variantTitle?: string;
      selectedOptions?: Record<string, any>;
    },
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<boolean>;
  removeItem: (lineItemId: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
}

const emptyCart: Cart = {
  id: "fs-cart",
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: "USD",
  freeShippingThreshold: 100,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync with live FatherShops Cart on mount & after actions
  const refreshLiveCart = useCallback(async (): Promise<Cart | null> => {
    try {
      await fathershopsClient.ensureSession();
      const res = await cartService.getCart();
      if (res.data) {
        const normalized = normalizeCart(res.data);
        setCart(normalized);
        return normalized;
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[CartContext] Live cart fetch error:", err?.message);
      }
    }
    return null;
  }, []);

  // Initial cart load from FatherShops session
  useEffect(() => {
    let mounted = true;

    async function initCart() {
      setIsLoading(true);
      try {
        const live = await refreshLiveCart();
        if (mounted) {
          if (live) {
            setCart(live);
          } else {
            setCart(emptyCart);
          }
        }
      } catch (err) {
        if (mounted) setCart(emptyCart);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initCart();

    return () => {
      mounted = false;
    };
  }, [refreshLiveCart]);

  const addItem = async (
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      thumbnail: string;
      variantId?: string;
      variantTitle?: string;
      selectedOptions?: Record<string, any>;
    },
    quantity = 1
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let productId = product.id;
      if (!/^\d+$/.test(productId)) {
        const match = product.slug?.match(/-(\d+)$/) || product.id.match(/-(\d+)$/);
        if (match) productId = match[1];
      }

      let option: Record<string, any> = {};
      if (product.selectedOptions && Object.keys(product.selectedOptions).length > 0) {
        option = product.selectedOptions;
      } else if (product.variantId && /^\d+$/.test(product.variantId)) {
        option[product.variantId] = product.variantId;
      }

      let addRes = await cartService.addToCart({
        product_id: productId,
        quantity,
        option,
      });

      // If required options were missing (e.g. quick-add clicked on catalog card), auto-resolve defaults
      const hasOptionErrors =
        addRes.data?.options_popup ||
        addRes.data?.redirect ||
        (addRes.errors &&
          typeof addRes.errors === "object" &&
          Object.keys(addRes.errors).length > 0 &&
          !addRes.data?.success);

      if (hasOptionErrors && (!option || Object.keys(option).length === 0)) {
        try {
          const detailsRes = await catalogService.getProductDetails(productId);
          if (detailsRes.data?.options && detailsRes.data.options.length > 0) {
            const defaultOptions: Record<string, string> = {};
            for (const opt of detailsRes.data.options) {
              const optId = String(opt.product_option_id || opt.option_id);
              if (opt.product_option_value && opt.product_option_value.length > 0) {
                defaultOptions[optId] = String(opt.product_option_value[0].product_option_value_id);
              }
            }
            if (Object.keys(defaultOptions).length > 0) {
              addRes = await cartService.addToCart({
                product_id: productId,
                quantity,
                option: defaultOptions,
              });
            }
          }
        } catch (detailErr) {
          console.warn("[CartContext] Failed to auto-resolve options for quick add:", detailErr);
        }
      }

      // Check if item was successfully added to live FatherShops cart
      const isLiveSuccess = Boolean(
        addRes.data?.success ||
        addRes.data?.items_count ||
        addRes.data?.notification ||
        (addRes.code === 200 && (!addRes.errors || (Array.isArray(addRes.errors) && addRes.errors.length === 0)))
      );

      if (isLiveSuccess) {
        const updatedLive = await refreshLiveCart();
        setIsOpen(true);
        setIsLoading(false);
        trackEvent("add_to_cart", {
          currency: updatedLive?.currency || "USD",
          value: product.price * quantity,
          items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity }],
        });
        return true;
      }

      // If product requires manual configuration (e.g. size/shade options), redirect to product details
      if (addRes.data?.options_popup && product.slug && typeof window !== "undefined") {
        setIsLoading(false);
        window.location.href = `/product/${product.slug}`;
        return false;
      }

      // Surface backend error to shopper
      const errorMsg = fathershopsClient.extractErrorMessage(addRes.errors) || "Failed to add item to your bag. Please check product options.";
      setError(errorMsg);
      setIsLoading(false);
      return false;
    } catch (err: any) {
      console.error("[CartContext] addToCart error:", err);
      setError(err?.message || "Unable to reach the cart service. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const buyNow = async (
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      thumbnail: string;
      variantId?: string;
      variantTitle?: string;
      selectedOptions?: Record<string, any>;
    },
    quantity = 1
  ) => {
    const success = await addItem(product, quantity);
    if (success && typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (quantity <= 0) {
        await cartService.removeFromCart(lineItemId);
      } else {
        await cartService.editCart({ [lineItemId]: quantity });
      }
      await refreshLiveCart();
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("[CartContext] updateQuantity error:", err);
      setError(err?.message || "Unable to update item quantity.");
      setIsLoading(false);
      return false;
    }
  };

  const removeItem = async (lineItemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const removedItem = cart?.items.find((i) => i.id === lineItemId);
      await cartService.removeFromCart(lineItemId);
      await refreshLiveCart();
      setIsLoading(false);
      if (removedItem) {
        trackEvent("remove_from_cart", {
          item_id: removedItem.productId || removedItem.id,
          item_name: removedItem.name,
          value: removedItem.price * removedItem.quantity,
          currency: cart?.currency || "USD",
        });
      }
      return true;
    } catch (err: any) {
      console.error("[CartContext] removeItem error:", err);
      setError(err?.message || "Unable to remove item from bag.");
      setIsLoading(false);
      return false;
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (cart && cart.items.length > 0) {
        for (const item of cart.items) {
          try {
            await cartService.removeFromCart(item.id);
          } catch {}
        }
      }
      await refreshLiveCart();
    } catch (err) {
      console.error("[CartContext] clearCart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await cartService.applyCoupon(couponCode);
      const errors = res.errors;

      if (errors && (Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0)) {
        const msg = fathershopsClient.extractErrorMessage(errors) || "Invalid coupon code.";
        setIsLoading(false);
        return { success: false, message: msg };
      }

      if (res.data?.error) {
        setIsLoading(false);
        return { success: false, message: res.data.error };
      }

      await refreshLiveCart();
      setIsLoading(false);
      return {
        success: true,
        message: res.data?.success || "Coupon discount applied successfully!",
      };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        message: err?.message || "Failed to apply coupon. Please verify and try again.",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        error,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        clearError,
        addItem,
        buyNow,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
