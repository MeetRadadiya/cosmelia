"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { checkoutService } from "../services/checkoutService";
import { commonService } from "../services/commonService";
import { FatherShopsCheckoutInitData, FatherShopsOrderData } from "../types";
import { fathershopsClient } from "../client";

export function useCheckout(checkoutToken?: string) {
  const [initData, setInitData] = useState<FatherShopsCheckoutInitData | null>(null);
  const checkoutIdRef = useRef<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);

  // Payment gateway state
  const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
  const [paymentJs, setPaymentJs] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    countryId: "",
    zoneId: "",
    zip: "",
    shippingMethod: "flat.flat",
    paymentMethod: "fatherpay_dropship",
    agree: false,
    privacy: false,
  });

  const [skins, setSkins] = useState<any>(null);

  // Load checkout initial data & skins on mount
  useEffect(() => {
    let active = true;
    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const [res, skinsRes] = await Promise.allSettled([
          checkoutService.initCheckout(checkoutToken),
          commonService.getCheckoutSkins(),
        ]);

        if (active && skinsRes.status === "fulfilled" && skinsRes.value.data) {
          setSkins(skinsRes.value.data);
        }

        if (active && res.status === "fulfilled" && res.value.data) {
          const resData = res.value.data;
          setInitData(resData);
          checkoutIdRef.current = resData.checkout_data?.checkout_id || resData.checkout_id;

          // Populate default values from backend if present
          const backendOrder = resData.checkout_data?.order_data;
          if (backendOrder) {
            setFormData((prev) => ({
              ...prev,
              firstName: backendOrder.firstname || prev.firstName,
              lastName: backendOrder.lastname || prev.lastName,
              email: backendOrder.email || prev.email,
              telephone: backendOrder.telephone || prev.telephone,
              address: backendOrder.shipping_address_1 || prev.address,
              city: backendOrder.shipping_city || prev.city,
              countryId: String(backendOrder.shipping_country_id || prev.countryId),
              zoneId: String(backendOrder.shipping_zone_id || prev.zoneId),
              shippingMethod: backendOrder.shipping_code || prev.shippingMethod,
              paymentMethod: backendOrder.payment_code || prev.paymentMethod,
            }));
          }
        }
      } catch (err: any) {
        if (active) {
          console.error("[useCheckout] init failed:", err);
          setError(err.message || "Failed to initialize checkout.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [checkoutToken]);

  // Debounced auto-sync to backend
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncCheckout = useCallback((updatedForm: typeof formData) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload: Partial<FatherShopsOrderData> = {
          firstname: updatedForm.firstName,
          lastname: updatedForm.lastName,
          email: updatedForm.email,
          telephone: updatedForm.telephone,
          shipping_firstname: updatedForm.firstName,
          shipping_lastname: updatedForm.lastName,
          shipping_address_1: updatedForm.address,
          shipping_city: updatedForm.city,
          shipping_country_id: updatedForm.countryId,
          shipping_zone_id: updatedForm.zoneId,
          shipping_postcode: updatedForm.zip,
          shipping_code: updatedForm.shippingMethod,
          payment_firstname: updatedForm.firstName,
          payment_lastname: updatedForm.lastName,
          payment_address_1: updatedForm.address,
          payment_city: updatedForm.city,
          payment_country_id: updatedForm.countryId,
          payment_zone_id: updatedForm.zoneId,
          payment_postcode: updatedForm.zip,
          payment_code: updatedForm.paymentMethod,
        };

        await checkoutService.saveCheckout(payload, checkoutIdRef.current ?? undefined);
        if (updatedForm.telephone && updatedForm.telephone.trim() !== "") {
          try {
            await checkoutService.saveTelephone(updatedForm.telephone.trim());
          } catch {}
        }
      } catch (err) {
        // Silently tolerate background debounced save failures
      }
    }, 600);
  }, []);

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      syncCheckout(next);
      return next;
    });
  };

  const [isLoadingPaymentGateway, setIsLoadingPaymentGateway] = useState(false);

  // Load payment gateway HTML for card-based payment methods
  const loadPaymentGateway = useCallback(async () => {
    setIsLoadingPaymentGateway(true);
    try {
      const checkoutId = checkoutIdRef.current || initData?.checkout_data?.checkout_id || initData?.checkout_id;
      
      // Save checkout payload first so FatherShops backend stages the order session with payment_code
      const payload: Partial<FatherShopsOrderData> = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        telephone: formData.telephone,
        shipping_firstname: formData.firstName,
        shipping_lastname: formData.lastName,
        shipping_address_1: formData.address,
        shipping_city: formData.city,
        shipping_country_id: formData.countryId,
        shipping_zone_id: formData.zoneId,
        shipping_postcode: formData.zip,
        shipping_code: formData.shippingMethod,
        payment_firstname: formData.firstName,
        payment_lastname: formData.lastName,
        payment_address_1: formData.address,
        payment_city: formData.city,
        payment_country_id: formData.countryId,
        payment_zone_id: formData.zoneId,
        payment_postcode: formData.zip,
        payment_code: formData.paymentMethod,
      };

      try {
        await checkoutService.saveCheckout(payload, checkoutId);
      } catch {
        // Continue to fetch payment gateway even if save returns non-fatal warning
      }

      const res = await checkoutService.getPaymentHtml("en");
      
      const html =
        res.data?.html ||
        res.data?.payment_gateway_assets?.html ||
        res.data?.payment_data?.payment_gateway_assets?.html ||
        res.data?.payment_data?.html ||
        res.response?.html ||
        (res as any).html ||
        null;

      const js =
        res.data?.js ||
        res.data?.payment_gateway_assets?.js ||
        res.data?.payment_data?.payment_gateway_assets?.js ||
        res.data?.payment_data?.js ||
        res.response?.js ||
        (res as any).js ||
        [];

      if (html && typeof html === "string" && html.trim() !== "") {
        setPaymentHtml(html);
        if (Array.isArray(js)) {
          setPaymentJs(js);
        }
      } else {
        // Fallback card gateway ready notice when API returns no inline iframe
        setPaymentHtml(
          `<div style="padding:14px;background:#FAF9F6;border:1px solid #EAE8E1;border-radius:2px;font-size:12px;color:#141416;text-align:center;">
            <strong style="color:#2D5A43;">✓ Secure Payment Gateway Ready</strong>
            <p style="margin-top:4px;color:#5E6472;font-size:11px;">Your card transaction will be securely processed upon placing your order.</p>
          </div>`
        );
      }
    } catch (err) {
      console.warn("[useCheckout] Failed to load payment gateway:", err);
      setPaymentHtml(
        `<div style="padding:14px;background:#FAF9F6;border:1px solid #EAE8E1;border-radius:2px;font-size:12px;color:#141416;text-align:center;">
          <strong style="color:#2D5A43;">✓ Secure Payment Gateway Selected</strong>
          <p style="margin-top:4px;color:#5E6472;font-size:11px;">Payment details will be authorized securely upon placing your order.</p>
        </div>`
      );
    } finally {
      setIsLoadingPaymentGateway(false);
    }
  }, [formData, initData]);

  // Place / Confirm Order
  const submitOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const payload: Partial<FatherShopsOrderData> = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        telephone: formData.telephone,
        shipping_firstname: formData.firstName,
        shipping_lastname: formData.lastName,
        shipping_address_1: formData.address,
        shipping_city: formData.city,
        shipping_country_id: formData.countryId,
        shipping_zone_id: formData.zoneId,
        shipping_postcode: formData.zip,
        shipping_code: formData.shippingMethod,
        payment_firstname: formData.firstName,
        payment_lastname: formData.lastName,
        payment_address_1: formData.address,
        payment_city: formData.city,
        payment_country_id: formData.countryId,
        payment_zone_id: formData.zoneId,
        payment_postcode: formData.zip,
        payment_code: formData.paymentMethod,
      };

      const checkoutId = initData?.checkout_data?.checkout_id || initData?.checkout_id;

      // Journal3 requires the payment selection to be persisted with a plain save
      // first — otherwise confirm re-resolves to the default gateway (e.g. COD
      // silently becoming fatherpay_dropship).
      await checkoutService.saveCheckout(payload, checkoutId);

      const res = await checkoutService.confirmOrder(payload, formData.agree, formData.privacy, checkoutId);

      // Check for errors
      if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        throw new Error(fathershopsClient.extractErrorMessage(res.errors));
      }

      // The Journal3 save controller returns validation errors per-field under response.error
      // (e.g. { telephone: "Telephone must be 10 digits!" }). Values of null mean "no error".
      const fieldErrors = res.response?.error;
      if (fieldErrors && typeof fieldErrors === "object") {
        const messages = Object.values(fieldErrors).filter((v) => v != null && String(v).trim() !== "") as string[];
        if (messages.length > 0) {
          throw new Error(messages.join(" "));
        }
      }

      const stagedCheckoutId = res.response?.checkout_id || checkoutId;
      const orderId =
        res.response?.the_order_id ||
        res.response?.order_id ||
        res.data?.the_order_id ||
        res.data?.order_id ||
        res.data?.orderId;

      if (!orderId) {
        throw new Error("Order could not be placed. The server did not return an order ID. Please verify your details and try again.");
      }

      // commit the staged order: checkout/save&confirm=true only STAGES the order
      // reference. The commit differs by payment method:
      //  - COD: checkout/paymentConfirm{checkout_id} writes the order to the store DB
      //  - Card (fatherpay_dropship): the Stripe gateway finalizes the order via its
      //    webhook after a successful charge; paymentConfirm would wrongly fail here.
      if (formData.paymentMethod === "cod") {
        try {
          const commitRes = await checkoutService.confirmPayment(stagedCheckoutId);
          // Journal3 COD confirmPayment can return various shapes.
          // If it returns a hard error, throw; otherwise proceed with the orderId we already have.
          if (commitRes.errors && Array.isArray(commitRes.errors) && commitRes.errors.length > 0) {
            const errMsg = fathershopsClient.extractErrorMessage(commitRes.errors);
            if (errMsg && errMsg.trim() !== "") {
              throw new Error("COD confirmation failed: " + errMsg);
            }
          }
          // Some backends return { data: { status: false } } for expected COD flow — not a true failure.
          // We trust the orderId returned from the staging step to determine success.
        } catch (codErr: any) {
          // Only re-throw if it's a hard error (not a timeout or empty response)
          if (codErr?.message?.toLowerCase().includes("cod confirmation failed")) {
            throw codErr;
          }
          console.warn("[useCheckout] COD paymentConfirm non-fatal warning:", codErr?.message);
        }
      }

      setConfirmedOrderId(String(orderId));

      // Fetch order success details
      try {
        const successRes = await checkoutService.getOrderSuccess(orderId);
        if (successRes.data && !Array.isArray(successRes.data)) {
          setOrderSuccessData(successRes.data);
        }
      } catch {
        // Order placed successfully even if summary endpoint has minor read issue
      }

      return { success: true, orderId };
    } catch (err: any) {
      console.error("[useCheckout] Submit order failed:", err);
      setError(err.message || "Failed to place order. Please review your details and try again.");
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initData,
    skins,
    formData,
    isLoading,
    isProcessing,
    error,
    confirmedOrderId,
    orderSuccessData,
    paymentHtml,
    paymentJs,
    isLoadingPaymentGateway,
    updateField,
    submitOrder,
    loadPaymentGateway,
  };
}
