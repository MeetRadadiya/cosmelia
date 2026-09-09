"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { commonService } from "../fathershops/services/commonService";
import { FatherShopsCurrency, FatherShopsLanguage } from "../fathershops/types";

import { DEFAULT_CURRENCIES, convertAndFormatPrice, CurrencyRateInfo } from "../utils/format";

interface LocaleContextType {
  currencies: FatherShopsCurrency[];
  languages: FatherShopsLanguage[];
  currentCurrency: string;
  currentCurrencySymbol: string;
  currentLanguage: string;
  isLoading: boolean;
  setCurrency: (code: string) => Promise<void>;
  setLanguage: (code: string) => Promise<void>;
  formatCurrencyAmount: (amount: number, fromCurrency?: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<FatherShopsCurrency[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("cosmelia_currencies");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_CURRENCIES as FatherShopsCurrency[];
  });

  const [languages, setLanguages] = useState<FatherShopsLanguage[]>([]);
  const [currentCurrency, setCurrentCurrencyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cosmelia_currency") || process.env.NEXT_PUBLIC_CURRENCY || "USD";
    }
    return "USD";
  });
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cosmelia_language") || "en";
    }
    return "en";
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch store currencies & languages from FatherShops
  useEffect(() => {
    let mounted = true;

    async function loadLocaleData() {
      setIsLoading(true);
      try {
        const [currRes, langRes] = await Promise.allSettled([
          commonService.getCurrencies(),
          commonService.getLanguages(),
        ]);

        if (mounted) {
          if (currRes.status === "fulfilled" && Array.isArray(currRes.value?.data)) {
            // Only keep active currencies
            const active = currRes.value.data.filter(
              (c) => c.status === "1" || c.status === 1 || c.status === true || c.code === "USD"
            );
            const finalCurr = active.length > 0 ? active : currRes.value.data;
            setCurrencies(finalCurr);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("cosmelia_currencies", JSON.stringify(finalCurr));
              } catch {}
            }
          }
          if (langRes.status === "fulfilled" && Array.isArray(langRes.value?.data)) {
            setLanguages(langRes.value.data);
          }
        }
      } catch (err) {
        console.warn("[LocaleContext] Failed to load currencies/languages:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadLocaleData();

    return () => {
      mounted = false;
    };
  }, []);

  const activeCurrencyObj = currencies.find((c) => c.code.toUpperCase() === currentCurrency.toUpperCase());
  const currentCurrencySymbol =
    activeCurrencyObj?.symbol_left ||
    activeCurrencyObj?.symbol_right ||
    process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ||
    "$";

  const setCurrency = useCallback(async (code: string) => {
    const upper = code.toUpperCase();
    // 1. Immediately persist the choice
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cosmelia_currency", upper);
        document.cookie = `cosmelia_currency=${encodeURIComponent(upper)}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
    }

    // 2. Synchronize FatherShops session backend so next requests return prices in the new currency
    try {
      await commonService.updateCurrency(upper);
    } catch (err) {
      console.warn("[LocaleContext] Notice updating currency on backend:", err);
    }

    // 3. Reload the page so all product prices are re-fetched from FatherShops in the new currency.
    // FatherShops prices are session-currency-specific and cannot be locally converted accurately.
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const setLanguage = useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      await commonService.updateLanguage(code);
      setCurrentLanguageState(code);
      if (typeof window !== "undefined") {
        localStorage.setItem("cosmelia_language", code);
        window.location.reload();
      }
    } catch (err) {
      console.error("[LocaleContext] Error updating language:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatCurrencyAmount = useCallback(
    (amount: number): string => {
      return convertAndFormatPrice(amount, currentCurrency, currencies as CurrencyRateInfo[]);
    },
    [currencies, currentCurrency]
  );

  return (
    <LocaleContext.Provider
      value={{
        currencies,
        languages,
        currentCurrency,
        currentCurrencySymbol,
        currentLanguage,
        isLoading,
        setCurrency,
        setLanguage,
        formatCurrencyAmount,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
