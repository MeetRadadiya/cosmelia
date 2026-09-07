import {
  Product,
  Category,
  Cart,
  Customer,
  Order,
  ProductFilterParams,
  ProductListResult,
  CheckoutResult,
} from "../types";
import { CommerceProvider } from "../provider";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./data";

export class MockCommerceProvider implements CommerceProvider {
  public readonly name = "MockCommerceProvider";
  public readonly isOfficialIntegration = false;

  private inMemoryCarts: Map<string, Cart> = new Map();

  constructor() {
    // Initialise a demo cart if needed
    const defaultCartId = "default-cart";
    this.inMemoryCarts.set(defaultCartId, {
      id: defaultCartId,
      items: [
        {
          id: "item-1",
          productId: MOCK_PRODUCTS[0].id,
          productSlug: MOCK_PRODUCTS[0].slug,
          name: MOCK_PRODUCTS[0].name,
          price: MOCK_PRODUCTS[0].price,
          compareAtPrice: MOCK_PRODUCTS[0].compareAtPrice,
          quantity: 1,
          variantId: MOCK_PRODUCTS[0].variants[0]?.id,
          variantTitle: MOCK_PRODUCTS[0].variants[0]?.title,
          image: MOCK_PRODUCTS[0].thumbnail,
        },
      ],
      itemCount: 1,
      subtotal: MOCK_PRODUCTS[0].price,
      discount: 0,
      shipping: 0,
      tax: Math.round(MOCK_PRODUCTS[0].price * 0.08 * 100) / 100,
      total: Math.round((MOCK_PRODUCTS[0].price + MOCK_PRODUCTS[0].price * 0.08) * 100) / 100,
      currency: "USD",
      freeShippingThreshold: 100,
    });
  }

  async getProducts(params?: ProductFilterParams): Promise<ProductListResult> {
    let filtered = [...MOCK_PRODUCTS];

    if (params?.categorySlug) {
      filtered = filtered.filter((p) => p.categorySlug === params.categorySlug);
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.sort) {
      switch (params.sort) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
        default:
          break;
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      products: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getProduct(slug: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    return MOCK_PRODUCTS.slice(0, limit);
  }

  async getBestSellers(limit = 4): Promise<Product[]> {
    return MOCK_PRODUCTS.filter((p) => p.tags.includes("Best Seller") || p.rating >= 4.8).slice(0, limit);
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const current = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!current) return MOCK_PRODUCTS.slice(0, limit);
    return MOCK_PRODUCTS.filter((p) => p.id !== productId && p.categoryId === current.categoryId).slice(0, limit);
  }

  async searchProducts(query: string, limit = 8): Promise<Product[]> {
    if (!query) return [];
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, limit);
  }

  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  async getCategory(slug: string): Promise<Category | null> {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  private calculateCart(cart: Cart): Cart {
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= cart.freeShippingThreshold || subtotal === 0 ? 0 : 9.95;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax - cart.discount) * 100) / 100;

    return {
      ...cart,
      itemCount,
      subtotal,
      shipping,
      tax,
      total,
    };
  }

  async getCart(cartId = "default-cart"): Promise<Cart> {
    let cart = this.inMemoryCarts.get(cartId);
    if (!cart) {
      cart = {
        id: cartId,
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
      this.inMemoryCarts.set(cartId, cart);
    }
    return cart;
  }

  async addToCart(
    cartId = "default-cart",
    item: { productId: string; variantId?: string; quantity: number }
  ): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) throw new Error("Product not found");

    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : product.variants[0];
    const price = variant ? variant.price : product.price;

    const existingIdx = cart.items.findIndex(
      (i) => i.productId === item.productId && (!item.variantId || i.variantId === item.variantId)
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += item.quantity;
    } else {
      cart.items.push({
        id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price,
        compareAtPrice: variant?.compareAtPrice || product.compareAtPrice,
        quantity: item.quantity,
        variantId: variant?.id,
        variantTitle: variant?.title,
        image: variant?.image || product.thumbnail,
      });
    }

    const updated = this.calculateCart(cart);
    this.inMemoryCarts.set(cartId, updated);
    return updated;
  }

  async updateCartItem(cartId = "default-cart", lineItemId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(cartId);
    if (quantity <= 0) {
      return this.removeCartItem(cartId, lineItemId);
    }
    const target = cart.items.find((i) => i.id === lineItemId);
    if (target) {
      target.quantity = quantity;
    }
    const updated = this.calculateCart(cart);
    this.inMemoryCarts.set(cartId, updated);
    return updated;
  }

  async removeCartItem(cartId = "default-cart", lineItemId: string): Promise<Cart> {
    const cart = await this.getCart(cartId);
    cart.items = cart.items.filter((i) => i.id !== lineItemId);
    const updated = this.calculateCart(cart);
    this.inMemoryCarts.set(cartId, updated);
    return updated;
  }

  async clearCart(cartId = "default-cart"): Promise<Cart> {
    const empty: Cart = {
      id: cartId,
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
    this.inMemoryCarts.set(cartId, empty);
    return empty;
  }

  async createCheckout(cartId: string): Promise<CheckoutResult> {
    const cart = await this.getCart(cartId);
    return {
      requiresRedirect: false,
      sessionId: `mock_chk_${Date.now()}`,
      message: `Mock checkout initiated for cart ${cart.id} with ${cart.itemCount} items ($${cart.total}). For production FatherShops stores, configure FATHERSHOPS_CHECKOUT_URL.`,
      providerStatus: "adapter_integration_required",
    };
  }

  async getCustomer(token?: string): Promise<Customer | null> {
    if (!token) return null;
    return {
      id: "cust-demo-1",
      email: "client@cosmelia.com",
      firstName: "Elena",
      lastName: "Vance",
      phone: "+1 (555) 234-5678",
      defaultAddress: {
        id: "addr-1",
        firstName: "Elena",
        lastName: "Vance",
        address1: "742 Evergreen Terrace",
        city: "Beverly Hills",
        province: "CA",
        zip: "90210",
        country: "United States",
        isDefault: true,
      },
    };
  }

  async getCustomerOrders(_token?: string): Promise<Order[]> {
    return [
      {
        id: "ord-8092",
        orderNumber: "CSM-8092",
        createdAt: "2026-08-20T14:32:00Z",
        financialStatus: "paid",
        fulfillmentStatus: "fulfilled",
        total: 349,
        currency: "USD",
        shippingAddress: {
          id: "addr-1",
          firstName: "Elena",
          lastName: "Vance",
          address1: "742 Evergreen Terrace",
          city: "Beverly Hills",
          province: "CA",
          zip: "90210",
          country: "United States",
        },
        items: [
          {
            id: "ord-it-1",
            productId: MOCK_PRODUCTS[0].id,
            name: MOCK_PRODUCTS[0].name,
            variantTitle: "Pearl White",
            price: 349,
            quantity: 1,
            image: MOCK_PRODUCTS[0].thumbnail,
          },
        ],
      },
    ];
  }
}
