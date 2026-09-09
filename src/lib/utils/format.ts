/**
 * Currency and Price Formatting Utilities
 * Eliminates hard-coded currency symbols across the entire application.
 */

export interface CurrencyRateInfo {
  code: string;
  symbol_left?: string;
  symbol_right?: string;
  value?: string | number;
  decimal_place?: string | number;
}

export const DEFAULT_CURRENCIES: CurrencyRateInfo[] = [
  {
    code: "USD",
    symbol_left: "$",
    symbol_right: "",
    value: "0.27000000",
    decimal_place: "2",
  },
  {
    code: "EUR",
    symbol_left: "€",
    symbol_right: "",
    value: "0.26000000",
    decimal_place: "2",
  },
  {
    code: "GBP",
    symbol_left: "£",
    symbol_right: "",
    value: "0.21000000",
    decimal_place: "2",
  },
  {
    code: "SAR",
    symbol_left: "SAR.",
    symbol_right: "",
    value: "1.00000000",
    decimal_place: "2",
  },
  {
    code: "AED",
    symbol_left: "AED ",
    symbol_right: "",
    value: "0.98000000",
    decimal_place: "2",
  },
];

/**
 * Converts a base USD catalog price to any target currency using FatherShops exchange rates,
 * and formats it with appropriate currency symbol and decimals.
 */
export function convertAndFormatPrice(
  amountUSD: number,
  targetCurrencyCode = "USD",
  currenciesList: CurrencyRateInfo[] = DEFAULT_CURRENCIES
): string {
  if (typeof amountUSD !== "number" || isNaN(amountUSD)) return "$0.00";

  const targetCode = (targetCurrencyCode || "USD").toUpperCase();
  const list = currenciesList && currenciesList.length > 0 ? currenciesList : DEFAULT_CURRENCIES;

  const targetCurr =
    list.find((c) => c.code.toUpperCase() === targetCode) ||
    DEFAULT_CURRENCIES.find((c) => c.code.toUpperCase() === targetCode) || {
      code: targetCode,
      symbol_left: targetCode === "USD" ? "$" : targetCode + " ",
      symbol_right: "",
      value: "0.27",
      decimal_place: "2",
    };

  const usdObj =
    list.find((c) => c.code.toUpperCase() === "USD") ||
    DEFAULT_CURRENCIES.find((c) => c.code.toUpperCase() === "USD");
  const usdRate = usdObj?.value ? parseFloat(String(usdObj.value)) : 0.27;
  const targetRate = targetCurr?.value ? parseFloat(String(targetCurr.value)) : 0.27;

  // OpenCart / FatherShops rate formula:
  // Base store accounting currency is SAR (rate: 1.0).
  // 1 SAR = usdRate (0.27 USD) -> Price in SAR = amountUSD / usdRate.
  // 1 SAR = targetRate -> Price in Target = (amountUSD / usdRate) * targetRate.
  const converted =
    targetCode === "USD"
      ? amountUSD
      : (amountUSD / (usdRate > 0 ? usdRate : 0.27)) * (targetRate > 0 ? targetRate : 0.27);

  const decimals =
    targetCurr.decimal_place !== undefined ? parseInt(String(targetCurr.decimal_place), 10) : 2;

  const formattedNum = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const symLeft = targetCurr.symbol_left ? targetCurr.symbol_left.trim() : "";
  const symRight = targetCurr.symbol_right ? targetCurr.symbol_right.trim() : "";

  if (symRight) {
    return `${formattedNum} ${symRight}`;
  }
  if (symLeft) {
    const needsSpace = /[A-Za-z]/.test(symLeft);
    return needsSpace ? `${symLeft} ${formattedNum}` : `${symLeft}${formattedNum}`;
  }
  return `$${formattedNum}`;
}

export function formatPrice(
  amount: number,
  currency?: string,
  locale = "en-US"
): string {
  // If in browser and currency was not explicitly set to an alternative, check active selection
  let targetCurrency = currency;
  if (!targetCurrency || targetCurrency.toUpperCase() === "USD") {
    if (typeof window !== "undefined") {
      targetCurrency = localStorage.getItem("cosmelia_currency") || "USD";
    } else {
      targetCurrency = "USD";
    }
  }

  let currenciesList = DEFAULT_CURRENCIES;
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("cosmelia_currencies");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) currenciesList = parsed;
      }
    } catch {}
  }

  return convertAndFormatPrice(amount, targetCurrency, currenciesList);
}

export function calculateDiscountPercentage(
  price: number,
  compareAtPrice?: number
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Parses a numeric string (with currency symbols) into a float, matching mappers.parsePrice. */
export function parsePriceLocal(val: any): number {
  if (typeof val === "number") return Math.round(val * 100) / 100;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
