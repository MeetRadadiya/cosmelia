export interface ProductOptionValue {
  id: string;
  name: string;
  value: string;
  available?: boolean;
  image?: string;
  thumbnail?: string;
  price?: number;
  pricePrefix?: "+" | "-" | string;
  priceDelta?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: string;
}

export interface ProductBadge {
  text: string;
  variant: "primary" | "secondary" | "sale" | "neutral";
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  recommend?: boolean;
  helpfulCount?: number;
  images?: string[];
}


export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  hoverImage?: string;
  category: string;
  categoryId: string;
  categorySlug: string;
  tags: string[];
  sku?: string;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  available: boolean;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  options: ProductOption[];
  variants: ProductVariant[];
  features?: string[];
  specifications?: Record<string, string>;
  howToUse?: string[];
  ingredients?: string[];
  shippingInfo?: string;
  returnsInfo?: string;
  reviews?: ProductReview[];
  metadata?: Record<string, unknown>;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  productCount?: number;
  featured?: boolean;
  parentId?: string;
  children?: Category[];
}

export interface CartItem {
  id: string; // Line item unique id
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  variantId?: string;
  variantTitle?: string;
  image: string;
  options?: Record<string, string>;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  freeShippingThreshold: number;
}

export interface CustomerAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  countryId?: string;
  zoneId?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses?: CustomerAddress[];
  defaultAddress?: CustomerAddress;
  newsletterSubscribed?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  /** Raw human-readable status string from the API e.g. "Pending", "Processing", "Complete" */
  orderStatus?: string;
  financialStatus: "paid" | "pending" | "refunded";
  fulfillmentStatus: "fulfilled" | "unfulfilled" | "partial";
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: CustomerAddress;
  paymentMethod?: string;
  shippingMethod?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
  customer: Customer;
  loggedInAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  session?: AuthSession;
}

export interface ProductFilterParams {
  categorySlug?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CheckoutResult {
  url?: string;
  requiresRedirect: boolean;
  sessionId?: string;
  message?: string;
  providerStatus: "supported" | "redirect_required" | "adapter_integration_required";
}
