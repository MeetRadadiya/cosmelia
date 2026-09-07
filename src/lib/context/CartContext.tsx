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
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    thumbnail: string;
    variantId?: string;
    variantTitle?: string;
    selectedOptions?: Record<string, any>;
  }, quantity?: number) => Promise<void>;
  buyNow: (product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    thumbnail: string;
    variantId?: string;
    variantTitle?: string;
    selectedOptions?: Record<string, any>;
  }, quantity?: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
}

const defaultEmptyCart: Cart = {
  id: "client-cart",
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

  // Sync with live FatherShops Cart on mount
  const refreshLiveCart = useCallback(async () => {
    try {
      await fathershopsClient.ensureSession();
      const res = await cartService.getCart();
      if (res.data) {
        const normalized = normalizeCart(res.data);
        setCart(normalized);
        return normalized;
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[CartContext] Live cart fetch fallback:", err);
      }
    }
    return null;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initCart() {
      // 1. Attempt to load from live FatherShops backend
      const live = await refreshLiveCart();
      if (mounted && live && live.items.length > 0) {
        return;
      }

      // 2. Fallback to localStorage
      try {
        const saved = localStorage.getItem("cosmelia_cart");
        if (saved && mounted) {
          setCart(JSON.parse(saved));
          return;
        }
      } catch {
        // Ignore
      }

      if (mounted) {
        setCart(defaultEmptyCart);
      }
    }

    initCart();

    return () => {
      mounted = false;
    };
  }, [refreshLiveCart]);

  const saveLocalCart = (newCart: Cart) => {
    setCart(newCart);
    try {
      localStorage.setItem("cosmelia_cart", JSON.stringify(newCart));
    } catch {
      // safe fallback
    }
  };

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
  ) => {
    setIsLoading(true);

    // Try live FatherShops API first
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
        if (updatedLive && updatedLive.items.length > 0) {
          setIsOpen(true);
          setIsLoading(false);
          trackEvent("add_to_cart", {
            currency: "USD",
            value: product.price * quantity,
            items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity }],
          });
          return;
        }
      }

      // If product requires manual configuration and cannot be added automatically, redirect to detail page
      if (addRes.data?.options_popup && product.slug && typeof window !== "undefined") {
        setIsLoading(false);
        window.location.href = `/product/${product.slug}`;
        return;
      }
    } catch (err) {
      console.warn("[CartContext] Live addToCart fallback to local state:", err);
    }

    // Local state fallback
    const currentItems = cart ? [...cart.items] : [];
    const existingIndex = currentItems.findIndex(
      (item) => item.productId === product.id && (!product.variantId || item.variantId === product.variantId)
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
    } else {
      currentItems.push({
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        quantity,
        variantId: product.variantId,
        variantTitle: product.variantTitle,
        image: product.thumbnail,
      });
    }

    const itemCount = currentItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = currentItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9.95;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const newCart: Cart = {
      id: cart?.id || "cosmelia-session",
      items: currentItems,
      itemCount,
      subtotal,
      discount: 0,
      shipping,
      tax: 0,
      total,
      currency: "USD",
      freeShippingThreshold: 100,
    };

    saveLocalCart(newCart);
    setIsOpen(true);
    setIsLoading(false);

    trackEvent("add_to_cart", {
      currency: "USD",
      value: product.price * quantity,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity }],
    });
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
    },
    quantity = 1
  ) => {
    await addItem(product, quantity);
    if (typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    setIsLoading(true);

    // Try live FatherShops API
    try {
      if (quantity <= 0) {
        await cartService.removeFromCart(lineItemId);
      } else {
        await cartService.editCart({ [lineItemId]: quantity });
      }
      const updated = await refreshLiveCart();
      if (updated) {
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("[CartContext] Live updateQuantity fallback to local state:", err);
    }

    // Local fallback
    if (!cart) {
      setIsLoading(false);
      return;
    }
    let updatedItems: CartItem[];
    if (quantity <= 0) {
      updatedItems = cart.items.filter((i) => i.id !== lineItemId);
    } else {
      updatedItems = cart.items.map((i) =>
        i.id === lineItemId ? { ...i, quantity } : i
      );
    }

    const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9.95;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const newCart: Cart = {
      ...cart,
      items: updatedItems,
      itemCount,
      subtotal,
      total,
    };

    saveLocalCart(newCart);
    setIsLoading(false);
  };

  const removeItem = async (lineItemId: string) => {
    setIsLoading(true);

    try {
      await cartService.removeFromCart(lineItemId);
      const updated = await refreshLiveCart();
      if (updated) {
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("[CartContext] Live removeItem fallback to local state:", err);
    }

    if (!cart) {
      setIsLoading(false);
      return;
    }
    const updatedItems = cart.items.filter((i) => i.id !== lineItemId);
    const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9.95;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const newCart: Cart = {
      ...cart,
      items: updatedItems,
      itemCount,
      subtotal,
      total,
    };

    saveLocalCart(newCart);
    setIsLoading(false);
  };

  const clearCart = async () => {
    try {
      if (cart) {
        for (const item of cart.items) {
          await cartService.removeFromCart(item.id);
        }
      }
    } catch {
      // Ignore
    }
    saveLocalCart(defaultEmptyCart);
  };

  const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await cartService.applyCoupon(couponCode);
      if (res.errors && (Array.isArray(res.errors) ? res.errors.length > 0 : Object.keys(res.errors).length > 0)) {
        return {
          success: false,
          message: fathershopsClient.extractErrorMessage(res.errors) || "Coupon code is invalid or expired.",
        };
      }
      await refreshLiveCart();
      return {
        success: true,
        message: "Coupon discount applied successfully!",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Unable to apply coupon. Please try again.",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
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
