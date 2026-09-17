"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product } from "@/lib/commerce/types";
import { compareService } from "@/lib/fathershops/services/compareService";
import { useToast } from "@/lib/context/ToastContext";
import { truncateText } from "@/lib/utils/format";

const STORAGE_KEY = "cosmelia_compare_items";
const MAX_COMPARE_ITEMS = 4;

interface CompareContextValue {
  items: Product[];
  itemCount: number;
  maxItems: number;
  isInCompare: (productId: string) => boolean;
  addToCompare: (
    product: Product,
  ) => Promise<{ success: boolean; message: string }>;
  removeFromCompare: (productId: string) => Promise<void>;
  toggleCompare: (
    product: Product,
  ) => Promise<{ added: boolean; message: string }>;
  clearCompare: () => void;
  toast: { message: string; type: "success" | "warning" | "info" } | null;
  clearToast: () => void;
  isDockDismissed: boolean;
  setIsDockDismissed: (dismissed: boolean) => void;
}

const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showSuccess, showWarning, showInfo } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
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

  const clearToast = useCallback(() => {}, []);

  const isInCompare = useCallback(
    (productId: string) => {
      return items.some((item) => String(item.id) === String(productId));
    },
    [items],
  );

  const addToCompare = useCallback(
    async (
      product: Product,
    ): Promise<{ success: boolean; message: string }> => {
      const truncatedName = truncateText(product.name, 35);
      if (items.some((item) => String(item.id) === String(product.id))) {
        showInfo(
          "Already In Compare",
          `"${truncatedName}" is already in your comparison list.`,
        );
        return { success: false, message: "Already in comparison list." };
      }

      if (items.length >= MAX_COMPARE_ITEMS) {
        showWarning(
          "Compare Limit Reached",
          `You can compare up to ${MAX_COMPARE_ITEMS} products at a time.`,
        );
        return {
          success: false,
          message: `Maximum ${MAX_COMPARE_ITEMS} products can be compared.`,
        };
      }

      const updated = [...items, product];
      setItems(updated);
      setIsDockDismissed(false);
      showSuccess(
        "Added to Compare",
        `"${truncatedName}" added to comparison.`,
        {
          label: "View Compare",
          onClick: () => {
            if (typeof window !== "undefined")
              window.location.href = "/compare";
          },
        },
      );

      // Synchronize with FatherShops backend session in background
      try {
        await compareService.addToCompare(product.id);
      } catch (e) {
        console.warn("[CompareProvider] Backend sync error:", e);
      }

      return { success: true, message: "Added to comparison." };
    },
    [items, showInfo, showWarning, showSuccess],
  );

  const removeFromCompare = useCallback(
    async (productId: string) => {
      const removedProduct = items.find(
        (item) => String(item.id) === String(productId),
      );
      setItems((prev) =>
        prev.filter((item) => String(item.id) !== String(productId)),
      );

      if (removedProduct) {
        showInfo(
          "Removed from Compare",
          `"${truncateText(removedProduct.name, 35)}" removed from comparison.`,
        );
      }

      // Synchronize with FatherShops backend session
      try {
        await compareService.removeFromCompare(productId);
      } catch (e) {
        console.warn("[CompareProvider] Backend remove sync error:", e);
      }
    },
    [items, showInfo],
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
    [isInCompare, addToCompare, removeFromCompare],
  );

  const clearCompare = useCallback(() => {
    // Optionally trigger backend removal for each item
    items.forEach((item) => {
      compareService.removeFromCompare(item.id).catch(() => {});
    });
    setItems([]);
    showInfo("Compare Cleared", "All items removed from comparison list.");
  }, [items, showInfo]);

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
        toast: null,
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
