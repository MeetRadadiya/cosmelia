"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "@/lib/commerce/types";

export interface DynamicCategory extends Category {
  displayName?: string;
}

interface CategoryContextType {
  categories: DynamicCategory[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
}

// Fallback initial categories matching the current active FatherShops catalog
const INITIAL_CATEGORIES: DynamicCategory[] = [
  {
    id: "30",
    slug: "led-face-mask-30",
    name: "LED Face Mask",
    displayName: "LED Face Masks",
    description: "Multi-wavelength clinical phototherapy masks",
    image: "https://cdn.fathershops.com/f-images/catalog/1005005484832355/product_image_aesa_1005005484832355.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  {
    id: "31",
    slug: "neck-face-lifting-massager-31",
    name: "Neck Face Lifting Massager",
    displayName: "Neck & Face Lift Massagers",
    description: "Microcurrent & high-frequency sculpting instruments",
    image: "https://cdn.fathershops.com/f-images/catalog/1005007170717983/product_image_aesa_1005007170717983.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  {
    id: "24",
    slug: "ice-roller-24",
    name: "Ice Roller",
    displayName: "Ice Rollers & Cryo",
    description: "Cryo lymphatic drainage globes & rollers",
    image: "https://cdn.fathershops.com/f-images/catalog/1005012546280812/product_image_aesa_1005012546280812.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  {
    id: "21",
    slug: "pimple-patches-21",
    name: "Pimple Patches",
    displayName: "Acne & Pimple Patches",
    description: "Hydrocolloid invisible blemish stickers",
    image: "https://cdn.fathershops.com/f-images/catalog/1005012202383892/product_image_aesa_1005012202383892.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
  {
    id: "22",
    slug: "eye-patche-22",
    name: "Eye Patche",
    displayName: "Collagen Eye Patches",
    description: "Under-eye care stickers & soothing gel pads",
    image: "https://cdn.fathershops.com/f-images/catalog/1005010499076578/product_image_aesa_1005010499076578.jpg?origin=stock&origin=sites&width=600&height=600&aspect_ratio=1:1",
  },
];

const CategoryContext = createContext<CategoryContextType>({
  categories: INITIAL_CATEGORIES,
  loading: false,
  refreshCategories: async () => {},
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<DynamicCategory[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn("[CategoryContext] Failed to fetch dynamic categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
