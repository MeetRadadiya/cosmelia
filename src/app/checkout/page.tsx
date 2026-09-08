"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useLocations } from "@/lib/fathershops/hooks/useLocations";
import { useCheckout } from "@/lib/fathershops/hooks/useCheckout";

function buildGatewayDocument(html: string, js: string[]): string {
  const scriptTags = (js || [])
    .map((src) => `<script src="${src}"></` + `script>`)
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden !important;background:transparent;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#141416;}::-webkit-scrollbar{display:none !important;width:0 !important;height:0 !important;}</style>${scriptTags}</head><body><div id="gw-wrapper" style="padding:4px 0;">${html}</div><script>function notifyH(){try{var el=document.getElementById('gw-wrapper');var h=el?el.offsetHeight:document.body.scrollHeight;window.parent.postMessage({type:'PAYMENT_GATEWAY_HEIGHT',height:h},'*');}catch(e){}}window.addEventListener('load',notifyH);window.addEventListener('resize',notifyH);if(window.ResizeObserver){try{new ResizeObserver(notifyH).observe(document.body);}catch(e){}}setInterval(notifyH,300);</script></body></html>`;
}

function formatPaymentMethodTitle(code: string, rawTitle?: string): string {
  if (
    code === "fatherpay_dropship" ||
    code === "fatherpay" ||
    rawTitle?.toLowerCase().includes("fatherpay")
  ) {
    return "Credit / Debit Card";
  }
  if (
    code === "cod" ||
    rawTitle?.toLowerCase().includes("cash on delivery") ||
    rawTitle?.toLowerCase().includes("cod")
  ) {
    return "Cash On Delivery (COD)";
  }
  if (rawTitle && rawTitle.trim() !== "" && rawTitle !== code) {
    return rawTitle.replace(/<[^>]*>?/gm, "").trim();
  }
  return code.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const {
    initData,
    formData,
    isLoading: isCheckoutLoading,
    isProcessing,
    error: checkoutError,
    confirmedOrderId,
    orderSuccessData,
    paymentHtml,
    paymentJs,
    isLoadingPaymentGateway,
    updateField,
    submitOrder,
    loadPaymentGateway,
  } = useCheckout();

  const {
    countries,
    zones,
    cities,
    selectedCountry,
    selectedZone,
    isLoadingCountries,
    isLoadingZones,
    handleCountryChange,
    handleZoneChange,
  } = useLocations(
    formData.countryId || "99",
    initData?.checkout_data?.countries,
    initData?.checkout_data?.shipping_zones,
  );

  const [isSuccess, setIsSuccess] = useState(false);
  const [gatewayIframeHeight, setGatewayIframeHeight] = useState<number>(180);

  // Auto-resize payment iframe height based on messages from inside the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === "PAYMENT_GATEWAY_HEIGHT" &&
        typeof e.data.height === "number" &&
        e.data.height > 0
      ) {
        setGatewayIframeHeight(Math.max(120, e.data.height + 16));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Sync country selection
  const onCountrySelect = (countryId: string) => {
    updateField("countryId", countryId);
    handleCountryChange(countryId);
  };

  const onZoneSelect = (zoneIdOrCode: string) => {
    updateField("zoneId", zoneIdOrCode);
    handleZoneChange(zoneIdOrCode);
  };

  // Load FatherPay gateway when a card-based method is selected; clear for COD
  useEffect(() => {
    if (
      !isCheckoutLoading &&
      formData.paymentMethod &&
      formData.paymentMethod !== "cod" &&
      !isSuccess
    ) {
      loadPaymentGateway();
    }
  }, [
    isCheckoutLoading,
    formData.paymentMethod,
    isSuccess,
    loadPaymentGateway,
  ]);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitOrder();
    if (result.success) {
      setIsSuccess(true);
      await clearCart();
    }
  };

  if (isSuccess) {
    return (
      <div className="py-20 bg-[#FAF9F6] min-h-screen">
        <div className="luxury-container max-w-xl text-center bg-white border border-[#EAE8E1] rounded-sm p-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EBF1ED] text-[#2D5A43] flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">
            Thank You, {formData.firstName || "Customer"}
          </h1>
          <p className="text-xs text-[#5E6472] leading-relaxed">
            Your order{" "}
            <strong className="text-[#141416]">#{confirmedOrderId}</strong> has
            been successfully placed through FatherShops. A confirmation
            manifesto has been dispatched to{" "}
            <strong className="text-[#141416]">{formData.email}</strong>.
          </p>

          {orderSuccessData && (
            <div className="text-left bg-[#FAF9F6] border border-[#EAE8E1] p-4 rounded-sm space-y-2 text-xs text-[#5E6472]">
              <div className="flex justify-between border-b border-[#EAE8E1] pb-1 text-[#141416] font-medium">
                <span>Shipping Destination</span>
                <span>
                  {formData.city}, {formData.zip}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#EAE8E1] pb-1 text-[#141416] font-medium">
                <span>Payment Method</span>
                <span>
                  {formData.paymentMethod === "cod"
                    ? "Cash On Delivery"
                    : "FatherPay / Online"}
                </span>
              </div>
              <div className="flex justify-between text-[#141416] font-semibold pt-1">
                <span>Total Settled</span>
                <span>{formatPrice(cart?.total || 0)}</span>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link href="/">
              <Button variant="primary" size="md">
                Return To Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Shipping methods from backend or default flat rate
  const backendShippingMethods = initData?.checkout_data?.shipping_methods;
  const shippingMethodList: Array<{
    code: string;
    title: string;
    cost: number;
  }> = [];

  if (backendShippingMethods && typeof backendShippingMethods === "object") {
    Object.values(backendShippingMethods).forEach((method) => {
      if (method && method.quote) {
        Object.values(method.quote).forEach((quote) => {
          shippingMethodList.push({
            code: quote.code,
            title: quote.title,
            cost:
              typeof quote.cost === "number"
                ? quote.cost
                : parseFloat(String(quote.cost)) || 0,
          });
        });
      }
    });
  }

  // Payment methods from backend formatted cleanly
  const backendPaymentMethods = initData?.checkout_data?.payment_methods;
  const paymentMethodList: Array<{ code: string; title: string }> = [];

  if (backendPaymentMethods && typeof backendPaymentMethods === "object") {
    Object.values(backendPaymentMethods).forEach((method) => {
      if (method && method.code) {
        paymentMethodList.push({
          code: method.code,
          title: formatPaymentMethodTitle(method.code, method.title),
        });
      }
    });
  }

  if (paymentMethodList.length === 0) {
    paymentMethodList.push(
      {
        code: "fatherpay_dropship",
        title: "Credit / Debit Card (FatherPay Gateway)",
      },
      { code: "cod", title: "Cash On Delivery (COD)" },
    );
  }

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs
          items={[
            { label: "Shopping Bag", href: "/cart" },
            { label: "Checkout Integration" },
          ]}
        />

        {/* Status banner */}

        {checkoutError && (
          <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-6">
          {/* Checkout Form */}
          <div className="lg:col-span-7 bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8 space-y-8">
            <form onSubmit={handleCompleteOrder} className="space-y-8">
              {/* 1. Patron Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416] border-b border-[#EAE8E1] pb-2">
                  1. Patron Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  <Input
                    label="Telephone"
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => updateField("telephone", e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Shipping Destination */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416] border-b border-[#EAE8E1] pb-2">
                  2. Shipping Destination
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                  <Input
                    label="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>

                <Input
                  label="Street Address"
                  required
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />

                {/* Country Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#5E6472] font-medium">
                    Country / Region
                  </label>
                  <select
                    className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                    value={selectedCountry}
                    onChange={(e) => onCountrySelect(e.target.value)}
                    disabled={isLoadingCountries}
                  >
                    {countries.length > 0 ? (
                      countries.map((c) => (
                        <option key={c.country_id} value={c.country_id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="99">United States</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Zone / State selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#5E6472] font-medium">
                      State / Zone
                    </label>
                    {zones.length > 0 ? (
                      <select
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                        value={selectedZone}
                        onChange={(e) => onZoneSelect(e.target.value)}
                        disabled={isLoadingZones}
                      >
                        <option value="">Select State</option>
                        {zones.map((z) => (
                          <option key={z.zone_id} value={z.zone_id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                        value={formData.zoneId}
                        placeholder="State / Region"
                        onChange={(e) => updateField("zoneId", e.target.value)}
                      />
                    )}
                  </div>

                  {/* City selection / input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#5E6472] font-medium">
                      City
                    </label>
                    {cities.length > 0 ? (
                      <select
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.city_id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                        value={formData.city}
                        placeholder="City"
                        onChange={(e) => updateField("city", e.target.value)}
                      />
                    )}
                  </div>

                  {/* Zip */}
                  <Input
                    label="Postal Code"
                    required
                    value={formData.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                  />
                </div>
              </div>

              {/* 3. Shipping Courier */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416] border-b border-[#EAE8E1] pb-2">
                  3. Delivery Courier & Method
                </h3>
                <div className="space-y-2">
                  {shippingMethodList.length > 0 ? (
                    shippingMethodList.map((m) => (
                      <label
                        key={m.code}
                        className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors ${
                          formData.shippingMethod === m.code
                            ? "border-[#141416] bg-[#FAF9F6]"
                            : "border-[#EAE8E1] hover:border-[#8C734B]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={m.code}
                            checked={formData.shippingMethod === m.code}
                            onChange={() =>
                              updateField("shippingMethod", m.code)
                            }
                            className="text-[#141416]"
                          />
                          <span className="text-xs font-medium text-[#141416]">
                            {m.title}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#141416]">
                          {m.cost === 0 ? "Complimentary" : formatPrice(m.cost)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <label className="flex items-center justify-between p-3 border border-[#141416] bg-[#FAF9F6] rounded-sm">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked
                          readOnly
                          className="text-[#141416]"
                        />
                        <span className="text-xs font-medium text-[#141416]">
                          Flat Shipping Rate (Express Delivery)
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#141416]">
                        {formatPrice(5.0)}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416] border-b border-[#EAE8E1] pb-2">
                  4. Payment Method (FatherPay / Encrypted Gateway)
                </h3>
                <div className="space-y-2">
                  {paymentMethodList.length > 0 ? (
                    paymentMethodList.map((p) => (
                      <label
                        key={p.code}
                        className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors ${
                          formData.paymentMethod === p.code
                            ? "border-[#141416] bg-[#FAF9F6]"
                            : "border-[#EAE8E1] hover:border-[#8C734B]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={p.code}
                            checked={formData.paymentMethod === p.code}
                            onChange={() =>
                              updateField("paymentMethod", p.code)
                            }
                          />
                          <span className="text-xs font-medium text-[#141416]">
                            {p.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C734B] uppercase tracking-wider">
                          Official Gateway
                        </span>
                      </label>
                    ))
                  ) : (
                    <label className="flex items-center justify-between p-3 border border-[#141416] bg-[#FAF9F6] rounded-sm">
                      <div className="flex items-center gap-3">
                        <input type="radio" checked readOnly />
                        <span className="text-xs font-medium text-[#141416]">
                          FatherPay Direct Card Gateway
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8C734B] uppercase tracking-wider">
                        Official Gateway
                      </span>
                    </label>
                  )}
                </div>

                {formData.paymentMethod !== "cod" && (
                  <div className="pt-2 space-y-3">
                    <p className="text-[11px] text-[#8B92A2] tracking-wide">
                      Card payments are processed securely by FatherPay. You
                      will complete payment on the FatherShops encrypted gateway
                      after your order is confirmed.
                    </p>
                    {isLoadingPaymentGateway ? (
                      <div className="border border-[#EAE8E1] bg-[#FAF9F6] rounded-sm p-4 text-center text-xs text-[#5E6472] flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-[#8C734B]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Initializing FatherPay Gateway…
                      </div>
                    ) : paymentHtml &&
                      (paymentHtml.includes("<iframe") ||
                        paymentHtml.includes("<form") ||
                        paymentHtml.includes("<script")) ? (
                      <iframe
                        title="Secure payment"
                        className="fatherpay-gateway w-full bg-white overflow-hidden transition-[height] duration-200"
                        style={{
                          height: `${gatewayIframeHeight}px`,
                          overflow: "hidden",
                        }}
                        scrolling="no"
                        srcDoc={buildGatewayDocument(paymentHtml, paymentJs)}
                        sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups"
                      />
                    ) : paymentHtml ? (
                      <div
                        className="border border-[#EAE8E1] rounded-sm"
                        dangerouslySetInnerHTML={{ __html: paymentHtml }}
                      />
                    ) : (
                      <div className="p-3 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-xs text-center text-[#2D5A43]">
                        ✓ FatherPay Encrypted Gateway Ready
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 text-xs text-[#5E6472]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => updateField("agree", e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the Terms & Conditions and Medical Disclaimer
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy}
                    onChange={(e) => updateField("privacy", e.target.checked)}
                    required
                  />
                  <span>
                    I accept the Privacy Policy regarding clinical order
                    fulfillment
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isProcessing || isCheckoutLoading}
                className="w-full py-4 text-sm"
              >
                Complete Reservation • {formatPrice(cart?.total || 0)}
              </Button>
            </form>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 space-y-6 sticky top-35">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#141416]">
                Bag Review ({cart?.itemCount || 0})
              </h3>

              <div className="divide-y divide-[#EAE8E1] max-h-80 overflow-y-auto">
                {cart?.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-medium text-[#141416]">{item.name}</p>
                      <p className="text-[#8B92A2]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-[#141416]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-[#EAE8E1] pt-4">
                <div className="flex justify-between text-[#5E6472]">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart?.subtotal || 0)}</span>
                </div>
                {cart?.discount && cart.discount > 0 ? (
                  <div className="flex justify-between text-[#2D5A43]">
                    <span>Coupon Savings</span>
                    <span>- {formatPrice(cart.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[#5E6472]">
                  <span>Shipping</span>
                  <span>
                    {cart?.shipping === 0
                      ? "Complimentary"
                      : formatPrice(cart?.shipping || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#141416] pt-2 border-t border-[#EAE8E1]">
                  <span>Total</span>
                  <span>{formatPrice(cart?.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
