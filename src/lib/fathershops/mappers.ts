/**
 * Normalized Mappers for FatherShops API.
 * Converts raw FatherShops backend data into frontend commerce models.
 * Ensures the UI never depends on raw OpenCart/FatherShops shapes.
 */

import { Product, Category, Cart, CartItem, ProductOption, ProductVariant, Customer, CustomerAddress, Order, OrderItem } from "../commerce/types";
import {
  FatherShopsRawProduct,
  FatherShopsRawCategory,
  FatherShopsRawCart,
  FatherShopsRawCartItem,
  FatherShopsCustomer,
  FatherShopsAddress,
  FatherShopsOrderSummary,
  FatherShopsAuthResponse,
} from "./types";

/**
 * Safely parses any currency string or numeric value into a standard float number.
 * Examples: "$44.89" -> 44.89, "44.8859" -> 44.89, "SAR 150.00" -> 150.00
 */
export function parsePrice(val: any): number {
  if (typeof val === "number") return Math.round(val * 100) / 100;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

export const KNOWN_CATEGORY_NAMES: Record<string, string> = {
  "21": "Pimple Patches",
  "22": "Eye Patches",
  "24": "Ice Rollers",
  "26": "Health & Beauty",
  "27": "Dropship Collection",
  "30": "LED Face Masks",
  "31": "Neck & Face Lift Massagers",
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "21": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
  "22": "https://images.unsplash.com/photo-1512290900676-26c2768656b2?auto=format&fit=crop&w=600&q=80",
  "24": "https://images.unsplash.com/photo-1608248597266-928dce5cf5db?auto=format&fit=crop&w=600&q=80",
  "26": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  "30": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  "31": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
};

/**
 * Generates a clean URL slug from product name or id.
 */
export function generateSlug(name: string, id: string | number): string {
  const base = (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base ? `${base}-${id}` : `product-${id}`;
}

/**
 * Normalizes a raw FatherShops product (from catalog or details) into the standard Product model.
 */
export function normalizeProduct(raw: FatherShopsRawProduct): Product {
  const id = String(raw.product_id || raw.id);
  const name =
    raw.name ||
    raw.descriptions?.en?.name ||
    raw.title ||
    `Product #${id}`;

  const slug = raw.slug || generateSlug(name, id);

  const rawSpecial = raw.special ? parsePrice(raw.special) : undefined;
  const regularPrice = parsePrice(raw.price);

  // If special price is present and lower, regular price becomes compareAtPrice
  let price = regularPrice;
  let compareAtPrice: number | undefined = undefined;

  if (rawSpecial && rawSpecial < regularPrice && rawSpecial > 0) {
    price = rawSpecial;
    compareAtPrice = regularPrice;
  } else if (raw.compare_price) {
    const comp = parsePrice(raw.compare_price);
    if (comp > price) compareAtPrice = comp;
  }

  // --------------------------------------------------------------------------
  // Image extraction
  //
  // Two shapes from the API:
  //   Catalog list  → flat strings: thumb (300px), thumb2x (600px), second_thumb
  //   Product detail → images[] array of objects with keys:
  //                    { image (850px), image2x (1700px), popup (1000px),
  //                      galleryThumb (80px), thumb (160px), thumb2x (320px) }
  // --------------------------------------------------------------------------
  const images: string[] = [];

  const addImage = (url: string | undefined | null) => {
    if (url && typeof url === "string" && !images.includes(url)) {
      images.push(url);
    }
  };

  if (Array.isArray(raw.images) && raw.images.length > 0) {
    // Detail API: prefer large images first
    raw.images.forEach((img: any) => {
      if (typeof img === "string") {
        addImage(img);
      } else if (img && typeof img === "object") {
        // Priority: image (850px) > popup (1000px) > image2x (1700px) > thumb2x
        addImage(img.image || img.popup || img.image2x || img.thumb2x || img.thumb || img.galleryThumb);
      }
    });
  }

  // Catalog list flat fields (also used as fallbacks for detail)
  // thumb2x is 600px — better quality than thumb 300px
  addImage(raw.thumb2x);
  addImage(raw.thumb);
  addImage(raw.second_thumb);
  addImage(raw.popup); // top-level popup from detail endpoint
  addImage(raw.image);

  // If no image is found, thumbnail is empty string.
  // The ProductCard <ImagePlaceholder> component handles the empty/error case gracefully.
  const thumbnail = images[0] || "";

  // Category mapping
  let categoryName = "";
  let categoryId = "1";
  let categorySlug = "";

  const rawCats = raw.categories;
  if (rawCats) {
    if (typeof rawCats === "string" || typeof rawCats === "number") {
      categoryId = String(rawCats);
    } else if (Array.isArray(rawCats) && rawCats.length > 0) {
      const cat = rawCats[0];
      if (typeof cat === "object" && cat !== null) {
        const extractedName =
          (cat as any).descriptions?.en?.name ||
          (cat as any).descriptions?.en?.meta_title ||
          (cat as any).name ||
          (cat as any).title ||
          "";
        if (extractedName) categoryName = extractedName;
        categoryId = String((cat as any).category_id || (cat as any).id || categoryId);
        categorySlug = (cat as any).slug || generateSlug(categoryName, categoryId);
      } else {
        categoryId = String(cat);
      }
    }
  } else if (raw.category) {
    if (typeof raw.category === "object" && raw.category !== null) {
      const extractedName =
        (raw.category as any).descriptions?.en?.name ||
        (raw.category as any).name ||
        (raw.category as any).title ||
        "";
      if (extractedName) categoryName = extractedName;
      categoryId = String((raw.category as any).id || categoryId);
      categorySlug = (raw.category as any).slug || generateSlug(categoryName, categoryId);
    } else {
      categoryId = String(raw.category);
    }
  }

  // Lookup category name from KNOWN_CATEGORY_NAMES if ID exists
  if (categoryId && (!categoryName || categoryName === "Skincare" || categoryName === "Category")) {
    if (KNOWN_CATEGORY_NAMES[categoryId]) {
      categoryName = KNOWN_CATEGORY_NAMES[categoryId];
    }
  }
  if (!categoryName) {
    categoryName = "Skincare";
  }
  if (!categorySlug) {
    categorySlug = generateSlug(categoryName, categoryId || "1");
  }

  // Stock status
  const stockAvailable =
    raw.stock === true ||
    raw.stock === "In Stock" ||
    (typeof raw.stock === "number" && raw.stock > 0) ||
    (typeof raw.quantity === "number" && raw.quantity > 0) ||
    raw.stock === "1" ||
    raw.stock === undefined;

  const stockStatus: Product["stockStatus"] = stockAvailable ? "in_stock" : "out_of_stock";

  // Rating & Review count - strictly match FatherShops backend
  const ratingRaw = typeof raw.rating === "number" ? raw.rating : parseFloat(String(raw.rating || 0)) || 0;
  const rating = Math.round(ratingRaw * 10) / 10;
  const reviewCount = typeof raw.reviews === "number" ? raw.reviews : parseInt(String(raw.reviews || 0), 10) || 0;

  // Options normalization
  const options: ProductOption[] = (raw.options || []).map((opt) => ({
    id: String(opt.product_option_id || opt.option_id),
    name: opt.descriptions?.en?.name || opt.name || "Option",
    values: (opt.product_option_value || []).map((val) => {
      let valPrice: number | undefined = undefined;
      if (typeof val.price === "string") {
        const mod = parseFloat(val.price.replace(/[^0-9.]/g, "")) || 0;
        valPrice = val.price_prefix === "-" ? Math.max(0, price - mod) : price + mod;
      }
      return {
        id: String(val.product_option_value_id),
        name: val.descriptions?.en?.name || val.name || "Default",
        value: String(val.product_option_value_id),
        image: val.image || undefined,
        price: valPrice,
        available: true,
      };
    }),
  }));

  // Variants normalization
  const variants: ProductVariant[] = [];
  if (options.length > 0 && options[0].values.length > 0) {
    options[0].values.forEach((val) => {
      const variantPrice = val.price !== undefined ? val.price : price;
      variants.push({
        id: val.id,
        title: val.name,
        price: variantPrice,
        compareAtPrice,
        available: true,
        image: val.image,
        selectedOptions: [{ name: options[0].name, value: val.name }],
      });
    });
  } else {
    variants.push({
      id: `${id}-default`,
      title: "Default",
      price,
      compareAtPrice,
      available: stockAvailable,
      selectedOptions: [],
    });
  }

  // Specifications from model, manufacturer, weight, minimum, and attribute_groups
  const specifications: Record<string, string> = {};
  if (raw.model) specifications["Model / SKU"] = String(raw.model);
  if (raw.manufacturer) specifications["Manufacturer"] = String(raw.manufacturer);
  if (raw.weight && String(raw.weight) !== "0" && String(raw.weight) !== "0.00") specifications["Weight"] = String(raw.weight);
  if (raw.minimum && Number(raw.minimum) > 1) specifications["Minimum Order Quantity"] = String(raw.minimum);

  if (Array.isArray(raw.attribute_groups)) {
    raw.attribute_groups.forEach((group) => {
      if (Array.isArray(group.attribute)) {
        group.attribute.forEach((attr) => {
          specifications[attr.name] = attr.text;
        });
      }
    });
  }

  const badges = [];
  if (compareAtPrice && compareAtPrice > price) {
    const discountPct = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    badges.push({ text: `Save ${discountPct}%`, variant: "sale" as const });
  }

  return {
    id,
    slug,
    name,
    tagline: raw.descriptions?.en?.meta_title || "Beauty Tools & Everyday Self-Care",
    description: raw.description || raw.descriptions?.en?.description || "",
    shortDescription: raw.short_description || raw.descriptions?.en?.meta_description || "",
    price,
    compareAtPrice,
    currency: "USD",
    images: images.length > 0 ? images : [thumbnail],
    thumbnail,
    hoverImage: images[1] || images[0] || thumbnail,
    category: categoryName,
    categoryId,
    categorySlug,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    sku: raw.model || raw.sku || `FS-${id}`,
    rating,
    reviewCount,
    badges,
    available: stockAvailable,
    stockStatus,
    options,
    variants,
    specifications,
  };
}

/**
 * Normalizes a raw FatherShops category.
 */
export function normalizeCategory(raw: FatherShopsRawCategory | any): Category {
  const id = String(raw.category_id || raw.id || "");

  let name = "";
  if (raw.descriptions) {
    name =
      raw.descriptions?.en?.name ||
      raw.descriptions?.en?.meta_title ||
      raw.descriptions?.ar?.name ||
      (Object.values(raw.descriptions)[0] as any)?.name ||
      (Object.values(raw.descriptions)[0] as any)?.meta_title ||
      "";
  }
  if (!name) {
    name = raw.name || raw.title || raw.category_description?.name || raw.meta_title || "";
  }
  if (!name || name === "null" || name === "Category") {
    name = KNOWN_CATEGORY_NAMES[id] || `Category ${id}`;
  }

  if (id && name) {
    KNOWN_CATEGORY_NAMES[id] = name;
  }

  const slug = raw.slug || generateSlug(name, id);
  const image = raw.image || raw.thumb || CATEGORY_FALLBACK_IMAGES[id] || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80";

  return {
    id,
    slug,
    name,
    description: raw.description || raw.descriptions?.en?.description || "Curated beauty & self-care essentials.",
    image,
    productCount: raw.total_products,
    parentId: raw.parent_id ? String(raw.parent_id) : undefined,
    children: Array.isArray(raw.children) ? raw.children.map(normalizeCategory) : undefined,
  };
}

/**
 * Normalizes raw FatherShops cart data into universal Cart model.
 */
export function normalizeCart(raw: FatherShopsRawCart): Cart {
  const rawItems = raw.products || raw.items || [];

  const items: CartItem[] = rawItems.map((item: FatherShopsRawCartItem) => {
    const id = String(item.cart_id || item.key);
    const productId = String(item.product_id);
    const price = parsePrice(item.price);
    const quantity = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity || 1)) || 1;

    let variantTitle: string | undefined;
    let variantId: string | undefined;

    if (Array.isArray(item.option) && item.option.length > 0) {
      variantTitle = item.option.map((o) => `${o.name}: ${o.value}`).join(", ");
      variantId = item.option[0].product_option_value_id
        ? String(item.option[0].product_option_value_id)
        : undefined;
    }

    return {
      id,
      productId,
      productSlug: generateSlug(item.name, productId),
      name: item.name,
      price,
      quantity,
      variantId,
      variantTitle,
      image: item.thumb || item.image || "",
    };
  });

  // Calculate totals from raw.totals array
  let subtotal = 0;
  let shipping = 0;
  let discount = 0;
  let total = 0;

  if (Array.isArray(raw.totals)) {
    raw.totals.forEach((t) => {
      const val = parsePrice(t.text || t.value);
      const title = (t.title || "").toLowerCase();
      const code = (t.code || "").toLowerCase();

      if (code === "sub_total" || title.includes("sub-total") || title.includes("subtotal")) {
        subtotal = val;
      } else if (code === "shipping" || title.includes("shipping")) {
        shipping = val;
      } else if (code === "coupon" || title.includes("coupon") || title.includes("discount")) {
        discount = val;
      } else if (code === "total" || title === "total") {
        total = val;
      }
    });
  }

  // Fallback calculations if totals array was missing
  if (subtotal === 0 && items.length > 0) {
    subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }
  if (total === 0) {
    total = Math.max(0, subtotal + shipping - discount);
  }

  const itemCount = typeof raw.cart_count === "number"
    ? raw.cart_count
    : items.reduce((acc, i) => acc + i.quantity, 0);

  return {
    id: "fathershop-cart",
    items,
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: 0,
    total: Math.round(total * 100) / 100,
    currency: "USD",
    freeShippingThreshold: 100,
  };
}

// --------------------------------------------------------------------------
// Account / Customer Mappers
// --------------------------------------------------------------------------

/**
 * Normalizes a raw FatherShops customer into the frontend Customer model.
 */
export function normalizeCustomer(raw: FatherShopsCustomer): Customer {
  const id = String(raw.customer_id ?? "");
  return {
    id,
    email: raw.email || "",
    firstName: raw.firstname || "",
    lastName: raw.lastname || "",
    phone: raw.telephone || "",
    newsletterSubscribed: raw.newsletter === "1" || raw.newsletter === 1 || String(raw.newsletter) === "true",
  };
}

/**
 * Normalizes a raw FatherShops address into the frontend CustomerAddress model.
 */
export function normalizeAddress(raw: FatherShopsAddress): CustomerAddress {
  const id = String(raw.address_id ?? "");
  const isDefaultVal = raw.default ?? raw.is_default;
  const zoneValue = raw.zone || (raw.zone_id !== undefined ? String(raw.zone_id) : undefined);
  return {
    id,
    firstName: raw.firstname || "",
    lastName: raw.lastname || "",
    company: raw.company || undefined,
    address1: raw.address_1 || "",
    address2: raw.address_2 || undefined,
    city: raw.city || "",
    province: zoneValue,
    zip: raw.postcode || "",
    country: raw.country || "",
    countryId: raw.country_id ? String(raw.country_id) : undefined,
    zoneId: raw.zone_id ? String(raw.zone_id) : undefined,
    isDefault: isDefaultVal === "1" || isDefaultVal === 1 || isDefaultVal === true,
  };
}

/**
 * Normalizes an array of raw addresses into frontend CustomerAddress models.
 */
export function normalizeAddresses(raw: FatherShopsAddress[] | undefined | null): CustomerAddress[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeAddress);
}

/**
 * Normalizes a raw FatherShops auth response into an AuthSession (in commerce types).
 */
export function normalizeAuthSession(raw: FatherShopsAuthResponse): {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
  customer: Customer;
  loggedInAt: string;
} {
  return {
    accessToken: raw.access_token || "",
    refreshToken: raw.refresh_token || "",
    expiresIn: raw.expires_in,
    customer: normalizeCustomer(raw.customer || {}),
    loggedInAt: new Date().toISOString(),
  };
}

/**
 * Normalizes a raw FatherShops order summary into the frontend Order model.
 */
export function normalizeOrder(raw: FatherShopsOrderSummary): Order {
  const rawAny = raw as any;
  const id = String(rawAny.order_id ?? rawAny.id ?? rawAny.order_number ?? rawAny.orderId ?? "");
  const rawProducts = Array.isArray(rawAny.products) ? rawAny.products : Array.isArray(rawAny.items) ? rawAny.items : [];
  const items: OrderItem[] = rawProducts.map((p: any) => ({
    id: String(p.order_product_id ?? p.product_id ?? p.id ?? ""),
    productId: String(p.product_id ?? p.id ?? ""),
    name: p.name || p.title || "Product",
    variantTitle: Array.isArray(p.option) && p.option.length > 0
      ? p.option.map((o: any) => o.value || o.name).join(" / ")
      : undefined,
    price: parsePrice(p.price),
    quantity: parseInt(String(p.quantity || "1"), 10) || 1,
    image: p.thumb || p.image || p.image_url || "",
  }));

  const rawTotals = Array.isArray(rawAny.totals) ? rawAny.totals : [];
  const totalText = rawTotals.find((t: any) => t.code === "total" || (t.title && t.title.toLowerCase() === "total"))?.value ?? rawAny.total;
  const total = parsePrice(totalText);

  const rawShipping = rawAny.shipping_address || rawAny.shippingAddress;
  const shippingAddress: CustomerAddress = {
    id: "",
    firstName: rawShipping?.firstname || rawShipping?.firstName || "",
    lastName: rawShipping?.lastname || rawShipping?.lastName || "",
    address1: rawShipping?.address_1 || rawShipping?.address1 || "",
    address2: rawShipping?.address_2 || rawShipping?.address2 || undefined,
    city: rawShipping?.city || "",
    province: rawShipping?.zone || rawShipping?.province || undefined,
    zip: rawShipping?.postcode || rawShipping?.zip || "",
    country: rawShipping?.country || "",
  };

  const status = (rawAny.order_status || rawAny.status || rawAny.order_status_name || "").toLowerCase();
  let fulfillmentStatus: Order["fulfillmentStatus"] = "unfulfilled";
  if (status.includes("complete") || status.includes("fulfilled") || status.includes("delivered")) {
    fulfillmentStatus = "fulfilled";
  } else if (status.includes("partial")) {
    fulfillmentStatus = "partial";
  }

  let financialStatus: Order["financialStatus"] = "pending";
  if (status.includes("paid") || status.includes("complete")) {
    financialStatus = "paid";
  } else if (status.includes("refund")) {
    financialStatus = "refunded";
  }

  let paymentMethod = rawAny.payment_method || rawAny.payment_method_name;
  if (!paymentMethod && rawAny.payment_code) {
    const code = String(rawAny.payment_code).toLowerCase();
    if (code === "cod") paymentMethod = "Cash On Delivery";
    else if (code.includes("fatherpay")) paymentMethod = "FatherPay";
    else paymentMethod = String(rawAny.payment_code).toUpperCase();
  }

  return {
    id,
    orderNumber: String(rawAny.order_number ?? rawAny.order_id ?? rawAny.id ?? id),
    createdAt: rawAny.date_added || rawAny.date_created || rawAny.createdAt || new Date().toISOString(),
    orderStatus: rawAny.order_status || rawAny.status || rawAny.order_status_name || undefined,
    financialStatus,
    fulfillmentStatus,
    total,
    currency: rawAny.currency_code || rawAny.currency || "USD",
    items,
    shippingAddress,
    paymentMethod: paymentMethod || undefined,
    shippingMethod: rawAny.shipping_method || rawAny.shipping_method_name || undefined,
  };
}

/**
 * Normalizes an array of raw orders into frontend Order models.
 */
export function normalizeOrders(raw: FatherShopsOrderSummary[] | undefined | null): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeOrder);
}
