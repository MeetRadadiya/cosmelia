import {
  Product,
  Category,
  Cart,
  Customer,
  Order,
  ProductFilterParams,
  ProductListResult,
  CheckoutResult,
} from "./types";

export interface CommerceProvider {
  name: string;
  isOfficialIntegration: boolean;

  // Catalog
  getProducts(params?: ProductFilterParams): Promise<ProductListResult>;
  getProduct(slug: string): Promise<Product | null>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  searchProducts(query: string, limit?: number): Promise<Product[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;

  // Cart
  getCart(cartId?: string): Promise<Cart>;
  addToCart(cartId: string, item: { productId: string; variantId?: string; quantity: number }): Promise<Cart>;
  updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart>;
  removeCartItem(cartId: string, lineItemId: string): Promise<Cart>;
  clearCart(cartId: string): Promise<Cart>;

  // Checkout
  createCheckout(cartId: string): Promise<CheckoutResult>;

  // Customer / Account
  getCustomer(token?: string): Promise<Customer | null>;
  getCustomerOrders(token?: string): Promise<Order[]>;
}
