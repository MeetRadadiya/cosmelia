# FatherShops Official Integration Specification

## 1. Platform Evaluation & Landscape
FatherShops (`fathershops.com` / `myfathershops.com`) is primarily positioned as an all-in-one e-commerce and dropshipping platform with built-in hosting, theme templates, and integrated payment facilities (such as FatherPay and regional gateway integrations like Tamara).

Publicly open, self-serve "Storefront Headless APIs" (similar to Shopify Storefront GraphQL) are **not published publicly without store administrative credentials or enterprise integration contracts**.

## 2. Strict Compliance Directives
In accordance with integration standards:
1. **Zero Endpoint Fabrication:** We do not invent fake URLs (e.g. `POST https://fathershops.com/api/cart`).
2. **Adapter Isolation:** All FatherShops code resides exclusively in `src/lib/fathershops/`.
3. **Safe Credentials Guard:** All API keys and secrets are processed on the Next.js server tier and never exposed to the client bundle.
4. **Fallback Resilience:** When credentials are not yet supplied, the store seamlessly uses `MockCommerceProvider` so design, marketing, and development can proceed without blockers.

## 3. Data Mapping Structure

### Product Mapping
```typescript
mapFatherShopsProductToProduct(raw: FatherShopsRawProduct): Product
```
- Maps `raw.id` -> `product.id`
- Maps `raw.name` / `raw.title` -> `product.name`
- Maps `raw.price` & `raw.compare_price` -> `product.price` & `product.compareAtPrice`
- Maps images array or primary image string to normalized image URLs.

### Checkout Handoff
```typescript
createCheckout(cartId: string): Promise<CheckoutResult>
```
- If `FATHERSHOPS_CHECKOUT_URL` is set: executes a clean redirect to the hosted FatherShops checkout carrying the cart session ID.
- If unconfigured: provides clear adapter guidance in the checkout interface.
