"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/commerce/types";
import { compareService } from "@/lib/fathershops/services/compareService";

const STORAGE_KEY = "cosmelia_compare_items";
const MAX_COMPARE_ITEMS = 4;

interface CompareContextValue {
  items: Product[];
  itemCount: number;
  maxItems: number;
  isInCompare: (productId: string) => boolean;
  addToCompare: (product: Product) => Promise<{ success: boolean; message: string }>;
  removeFromCompare: (productId: string) => Promise<void>;
  toggleCompare: (product: Product) => Promise<{ added: boolean; message: string }>;
  clearCompare: () => void;
  toast: { message: string; type: "success" | "warning" | "info" } | null;
  clearToast: () => void;
  isDockDismissed: boolean;
  setIsDockDismissed: (dismissed: boolean) => void;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);
  const [isDockDismissed, setIsDockDismissed] = useState(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage whenever items change after mount
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items, isInitialized]);

  // Toast auto-dismiss timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const isInCompare = useCallback(
    (productId: string) => {
      return items.some((item) => String(item.id) === String(productId));
    },
    [items]
  );

  const addToCompare = useCallback(
    async (product: Product): Promise<{ success: boolean; message: string }> => {
      if (items.some((item) => String(item.id) === String(product.id))) {
        setToast({ message: `"${product.name}" is already in your comparison list.`, type: "info" });
        return { success: false, message: "Already in comparison list." };
      }

      if (items.length >= MAX_COMPARE_ITEMS) {
        setToast({
          message: `You can compare up to ${MAX_COMPARE_ITEMS} products at a time. Remove an item first.`,
          type: "warning",
        });
        return { success: false, message: `Maximum ${MAX_COMPARE_ITEMS} products can be compared.` };
      }

      const updated = [...items, product];
      setItems(updated);
      setIsDockDismissed(false);
      setToast({
        message: `Added "${product.name}" to comparison.`,
        type: "success",
      });

      // Synchronize with FatherShops backend session in background
      try {
        await compareService.addToCompare(product.id);
      } catch (e) {
        console.warn("[CompareProvider] Backend sync error:", e);
      }

      return { success: true, message: "Added to comparison." };
    },
    [items]
  );

  const removeFromCompare = useCallback(
    async (productId: string) => {
      const removedProduct = items.find((item) => String(item.id) === String(productId));
      setItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));

      if (removedProduct) {
        setToast({
          message: `Removed "${removedProduct.name}" from comparison.`,
          type: "info",
        });
      }

      // Synchronize with FatherShops backend session
      try {
        await compareService.removeFromCompare(productId);
      } catch (e) {
        console.warn("[CompareProvider] Backend remove sync error:", e);
      }
    },
    [items]
  );

  const toggleCompare = useCallback(
    async (product: Product): Promise<{ added: boolean; message: string }> => {
      if (isInCompare(product.id)) {
        await removeFromCompare(product.id);
        return { added: false, message: "Removed from comparison." };
      } else {
        const res = await addToCompare(product);
        return { added: res.success, message: res.message };
      }
    },
    [isInCompare, addToCompare, removeFromCompare]
  );

  const clearCompare = useCallback(() => {
    // Optionally trigger backend removal for each item
    items.forEach((item) => {
      compareService.removeFromCompare(item.id).catch(() => {});
    });
    setItems([]);
    setToast({ message: "Comparison list cleared.", type: "info" });
  }, [items]);

  return (
    <CompareContext.Provider
      value={{
        items,
        itemCount: items.length,
        maxItems: MAX_COMPARE_ITEMS,
        isInCompare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        toast,
        clearToast,
        isDockDismissed,
        setIsDockDismissed,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
