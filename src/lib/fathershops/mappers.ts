/**
 * Normalized Mappers for FatherShops API.
 * Converts raw FatherShops backend data into frontend commerce models.
 * Ensures the UI never depends on raw OpenCart/FatherShops shapes.
 */

import { Product, Category, Cart, CartItem, ProductOption, ProductVariant } from "../commerce/types";
import {
  FatherShopsRawProduct,
  FatherShopsRawCategory,
  FatherShopsRawCart,
  FatherShopsRawCartItem,
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
  // Note: catalog list returns categories[] array of objects; detail returns categories as a string ID
  let categoryName = "Skincare";
  let categoryId = "1";
  let categorySlug = "skincare";

  const rawCats = raw.categories;
  if (rawCats) {
    if (typeof rawCats === "string" || typeof rawCats === "number") {
      // Detail API returns categories as a plain string ID e.g. "22"
      categoryId = String(rawCats);
    } else if (Array.isArray(rawCats) && rawCats.length > 0) {
      const cat = rawCats[0];
      if (typeof cat === "object" && cat !== null) {
        categoryName = cat.name || cat.title || categoryName;
        categoryId = String(cat.category_id || cat.id || categoryId);
        categorySlug = cat.slug || generateSlug(categoryName, categoryId);
      } else {
        categoryId = String(cat);
      }
    }
  } else if (raw.category) {
    if (typeof raw.category === "object") {
      categoryName = raw.category.name || categoryName;
      categoryId = String(raw.category.id || categoryId);
      categorySlug = raw.category.slug || generateSlug(categoryName, categoryId);
    } else {
      categoryId = String(raw.category);
    }
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

  // Rating
  const rating = typeof raw.rating === "number" ? raw.rating : parseFloat(String(raw.rating || 4.8)) || 4.8;
  const reviewCount = typeof raw.reviews === "number" ? raw.reviews : parseInt(String(raw.reviews || 16)) || 16;

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
    tagline: raw.descriptions?.en?.meta_title || "Clinical Skincare & Phototherapy",
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
export function normalizeCategory(raw: FatherShopsRawCategory): Category {
  const id = String(raw.category_id || raw.id);
  const name = raw.name || "Category";
  const slug = raw.slug || generateSlug(name, id);

  return {
    id,
    slug,
    name,
    description: raw.description || "",
    image: raw.image || raw.thumb,
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
