"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { checkoutService } from "../services/checkoutService";
import { FatherShopsCheckoutInitData, FatherShopsOrderData } from "../types";
import { fathershopsClient } from "../client";

export function useCheckout(checkoutToken?: string) {
  const [initData, setInitData] = useState<FatherShopsCheckoutInitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);

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
    cardNumber: "",
    exp: "",
    cvc: "",
    agree: false,
    privacy: false,
  });

  // Load checkout initial data on mount
  useEffect(() => {
    let active = true;
    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await checkoutService.initCheckout(checkoutToken);
        if (active && res.data) {
          setInitData(res.data);

          // Populate default values from backend if present
          const backendOrder = res.data.checkout_data?.order_data;
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

        await checkoutService.saveCheckout(payload);
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

      const res = await checkoutService.confirmOrder(payload, formData.agree, formData.privacy);

      // Check for errors
      if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        throw new Error(fathershopsClient.extractErrorMessage(res.errors));
      }

      const orderId =
        res.data?.order_id ||
        res.response?.order_id ||
        res.data?.orderId ||
        `FS-${Date.now().toString().slice(-6)}`;

      setConfirmedOrderId(String(orderId));

      // Fetch order success details
      try {
        const successRes = await checkoutService.getOrderSuccess(orderId);
        if (successRes.data) {
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
    formData,
    isLoading,
    isProcessing,
    error,
    confirmedOrderId,
    orderSuccessData,
    updateField,
    submitOrder,
  };
}
