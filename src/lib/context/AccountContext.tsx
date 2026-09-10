"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AuthSession, Customer } from "../commerce/types";
import { accountService } from "../fathershops/services/accountService";
import { normalizeAuthSession, normalizeCustomer, normalizeOrders, normalizeAddresses } from "../fathershops/mappers";
import { fathershopsClient } from "../fathershops/client";

const AUTH_STORAGE_KEY = "cosmelia_auth_session";

interface AccountContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (params: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirm: string;
    telephone?: string;
    newsletter?: boolean | string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { firstname?: string; lastname?: string; email?: string; telephone?: string }) => Promise<{ success: boolean; message: string }>;
  changePassword: (password: string, confirm: string) => Promise<{ success: boolean; message: string }>;
  getOrders: () => Promise<import("../commerce/types").Order[]>;
  getOrderDetail: (orderId: string) => Promise<any>;
  getAddresses: () => Promise<import("../commerce/types").CustomerAddress[]>;
  saveAddress: (address: Record<string, any>) => Promise<{ success: boolean; message: string }>;
  deleteAddress: (addressId: string) => Promise<{ success: boolean; message: string }>;
  setDefaultAddress: (addressId: string) => Promise<{ success: boolean; message: string }>;
  getWishlist: () => Promise<any>;
  toggleWishlist: (productId: string, add?: boolean) => Promise<{ success: boolean; message: string }>;
  getNewsletter: () => Promise<boolean>;
  updateNewsletter: (subscribed: boolean) => Promise<{ success: boolean; message: string }>;
  trackOrder: (trackingCode: string) => Promise<any>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const GUEST_ADDRESSES_STORAGE_KEY = "cosmelia_guest_addresses";
const getUserAddressesKey = (userId?: string | number) => `cosmelia_addresses_${userId || "default"}`;

function loadSessionFromStorage(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.accessToken && parsed.customer) {
      return parsed as AuthSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hydratedRef = useRef(false);

  // Load persisted session on mount (deferred a tick to avoid setState in effect body)
  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (!mounted) return;
      const stored = loadSessionFromStorage();
      if (stored) {
        setSession(stored);
        setCustomer(stored.customer);
      }
      hydratedRef.current = true;
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = useCallback((s: AuthSession | null) => {
    if (!s) {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {}
      setSession(null);
      setCustomer(null);
      return;
    }
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(s));
    } catch {}
    setSession(s);
    setCustomer(s.customer);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await accountService.login(email, password);
        const data = res.data as any;

        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to sign in. Please check your credentials.",
          };
        }

        if (!data?.access_token) {
          return {
            success: false,
            message: "Unable to authenticate. No access token returned.",
          };
        }

        const authSession = normalizeAuthSession(data);
        // Merge newsletter if present; unknown at login -> false default ok
        persistSession(authSession);

        return {
          success: true,
          message: "Welcome back! You are now signed in.",
        };
      } catch (err: any) {
        return {
          success: false,
          message: err?.message || "Unable to sign in. Please try again.",
        };
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (params: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      confirm: string;
      telephone?: string;
      newsletter?: boolean | string;
    }) => {
      try {
        const res = await accountService.register(params);
        const data = res.data as any;

        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to create your account.",
          };
        }

        if (!data?.access_token) {
          return {
            success: false,
            message: "Account created, but no session token was returned. Please sign in.",
          };
        }

        const authSession = normalizeAuthSession(data);
        persistSession(authSession);

        return {
          success: true,
          message: "Your account has been created successfully.",
        };
      } catch (err: any) {
        return {
          success: false,
          message: err?.message || "Unable to create your account. Please try again.",
        };
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      await accountService.logout();
    } catch {
      // Non-fatal - clear local state regardless
    }
    // Clear session & session ID
    fathershopsClient.clearSession();
    persistSession(null);
  }, [persistSession]);

  const refreshProfile = useCallback(async () => {
    const token = session?.accessToken;
    if (!token) return;
    try {
      const res = await accountService.getProfile(token);
      if (res.data && !res.errors) {
        const fresh = normalizeCustomer(res.data);
        setCustomer(fresh);
        setSession((prev) => (prev ? { ...prev, customer: fresh } : prev));
        persistSession({ ...(session as AuthSession), customer: fresh });
      }
    } catch {
      // Ignore - keep cached customer
    }
  }, [session, persistSession]);

  const updateProfile = useCallback(
    async (data: { firstname?: string; lastname?: string; email?: string; telephone?: string }) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to update your profile." };
      }
      try {
        const res = await accountService.updateProfile(token, data);
        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to update profile.",
          };
        }
        await refreshProfile();
        return { success: true, message: "Profile updated successfully." };
      } catch (err: any) {
        return { success: false, message: err?.message || "Unable to update profile." };
      }
    },
    [session, refreshProfile]
  );

  const changePassword = useCallback(
    async (password: string, confirm: string) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to change your password." };
      }
      try {
        const res = await accountService.changePassword(token, password, confirm);
        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to change password.",
          };
        }
        return { success: true, message: "Password updated successfully." };
      } catch (err: any) {
        return { success: false, message: err?.message || "Unable to change password." };
      }
    },
    [session]
  );

  const getOrders = useCallback(async () => {
    const token = session?.accessToken || loadSessionFromStorage()?.accessToken;
    if (!token) return [];
    try {
      const res = await accountService.getOrders(token);
      // The API can return orders in different shapes:
      // { data: { orders: [...] } } — most common
      // { data: [...] }            — array directly
      // { data: { data: { orders: [...] } } } — double-wrapped
      const raw = res.data as any;
      let rawOrders: any[] = [];
      if (Array.isArray(raw)) {
        rawOrders = raw;
      } else if (raw && Array.isArray(raw.orders)) {
        rawOrders = raw.orders;
      } else if (raw?.data && Array.isArray(raw.data.orders)) {
        rawOrders = raw.data.orders;
      } else if (raw?.data && Array.isArray(raw.data)) {
        rawOrders = raw.data;
      }
      return normalizeOrders(rawOrders);
    } catch {
      return [];
    }
  }, [session]);

  const getOrderDetail = useCallback(
    async (orderId: string) => {
      const token = session?.accessToken || loadSessionFromStorage()?.accessToken;
      if (!token) return null;
      try {
        const res = await accountService.getOrderDetail(token, orderId);
        const resAny = res as any;

        const isOrder = (obj: any): boolean =>
          obj !== null &&
          obj !== undefined &&
          typeof obj === "object" &&
          !Array.isArray(obj) &&
          (obj.order_id !== undefined || obj.order_number !== undefined || obj.id !== undefined || obj.orderId !== undefined || obj.products !== undefined);

        if (isOrder(resAny?.data)) return resAny.data;
        if (isOrder(resAny?.data?.order)) return resAny.data.order;
        if (isOrder(resAny?.response)) return resAny.response;
        if (isOrder(resAny)) return resAny;
        if (isOrder(resAny?.order)) return resAny.order;

        if (resAny?.data && typeof resAny.data === "object" && !Array.isArray(resAny.data) && Object.keys(resAny.data).length > 0) {
          return resAny.data;
        }

        return null;
      } catch (err) {
        return null;
      }
    },
    [session]
  );

  const getAddresses = useCallback(async () => {
    const token = session?.accessToken;
    const userId = session?.customer?.id;

    if (token) {
      try {
        const res = await accountService.getAddresses(token);
        // Handle multiple possible response shapes:
        // Shape 1: { data: [...] }  — array directly
        // Shape 2: { data: { addresses: [...] } } — nested under "addresses" key
        // Shape 3: { data: { data: [...] } } — double-wrapped
        let rawList: any[] | null = null;
        if (Array.isArray(res.data)) {
          rawList = res.data;
        } else if (res.data && Array.isArray((res.data as any).addresses)) {
          rawList = (res.data as any).addresses;
        } else if (res.data && Array.isArray((res.data as any).data)) {
          rawList = (res.data as any).data;
        }

        if (rawList && rawList.length > 0) {
          const list = normalizeAddresses(rawList as any);
          try {
            localStorage.setItem(getUserAddressesKey(userId), JSON.stringify(list));
          } catch {}
          return list;
        }

        // API returned successfully but empty array — clear the cache so stale data doesn't show
        if (rawList !== null && rawList.length === 0) {
          try {
            localStorage.removeItem(getUserAddressesKey(userId));
          } catch {}
          return [];
        }
      } catch (err) {
        console.warn("[AccountContext] getAddresses remote fetch failed:", err);
      }

      // Check cached user addresses
      try {
        const cached = localStorage.getItem(getUserAddressesKey(userId));
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }

    // Guest addresses fallback
    try {
      const guestRaw = localStorage.getItem(GUEST_ADDRESSES_STORAGE_KEY);
      if (guestRaw) {
        const parsed = JSON.parse(guestRaw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}

    return [];
  }, [session]);

  const saveAddress = useCallback(
    async (address: Record<string, any>) => {
      const token = session?.accessToken;
      const userId = session?.customer?.id;

      // Format payload according to OpenCart expectations
      const payload: Record<string, any> = {
        firstname: String(address.firstname || address.firstName || "").trim(),
        lastname: String(address.lastname || address.lastName || "").trim(),
        company: address.company ? String(address.company).trim() : "",
        address_1: String(address.address_1 || address.address1 || "").trim(),
        address_2: address.address_2 || address.address2 ? String(address.address_2 || address.address2).trim() : "",
        city: String(address.city || "").trim(),
        postcode: String(address.postcode || address.zip || "").trim(),
        country_id: String(address.country_id || address.countryId || "223"),
        zone_id: address.zone_id !== undefined ? String(address.zone_id) : (address.zoneId ? String(address.zoneId) : ""),
        telephone: address.telephone || address.phone ? String(address.telephone || address.phone).trim() : "",
        default: address.default === "1" || address.default === 1 || address.isDefault ? "1" : "0",
      };

      // Only pass address_id to the API if it's a genuine numeric server-assigned ID.
      // Local/guest IDs like addr_* and local_* must NOT be sent as address_id.
      const candidateId = address.address_id || (address.id && !String(address.id).startsWith("addr_") && !String(address.id).startsWith("local_") ? address.id : undefined);
      if (candidateId && /^\d+$/.test(String(candidateId))) {
        payload.address_id = String(candidateId);
      }

      let remoteSaved = false;
      let remoteError = "";

      if (token) {
        try {
          const res = await accountService.saveAddress(token, payload);
          if (res.errors && Object.keys(res.errors || {}).length > 0) {
            remoteError = fathershopsClient.extractErrorMessage(res.errors) || "Failed to save address on server.";
          } else if (res.code === 200 || res.data) {
            remoteSaved = true;
            if (res.data && res.data.address_id) {
              payload.address_id = String(res.data.address_id);
            }
          }
        } catch (err: any) {
          console.warn("[AccountContext] saveAddress remote error:", err);
          remoteError = err?.message || "Failed to save address on server.";
        }
      }

      // Always update local cache so the UI updates immediately and resiliently
      try {
        const storageKey = token ? getUserAddressesKey(userId) : GUEST_ADDRESSES_STORAGE_KEY;
        const currentRaw = localStorage.getItem(storageKey);
        let list: import("../commerce/types").CustomerAddress[] = currentRaw ? JSON.parse(currentRaw) : [];
        if (!Array.isArray(list)) list = [];

        const isDefault = payload.default === "1";
        if (isDefault) {
          list = list.map((a) => ({ ...a, isDefault: false }));
        }

        const addressId = payload.address_id || `addr_${Date.now()}`;
        const normalizedItem: import("../commerce/types").CustomerAddress = {
          id: addressId,
          firstName: payload.firstname,
          lastName: payload.lastname,
          company: payload.company || undefined,
          address1: payload.address_1,
          address2: payload.address_2 || undefined,
          city: payload.city,
          province: address.province || address.zone || (payload.zone_id ? String(payload.zone_id) : undefined),
          zip: payload.postcode,
          country: address.country || (payload.country_id === "223" ? "United States" : ""),
          countryId: payload.country_id,
          zoneId: payload.zone_id,
          phone: payload.telephone || undefined,
          isDefault: isDefault || list.length === 0,
        };

        const existingIdx = list.findIndex((a) => a.id === addressId);
        if (existingIdx >= 0) {
          list[existingIdx] = normalizedItem;
        } else {
          list.unshift(normalizedItem);
        }

        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch (e) {
        console.warn("[AccountContext] local save error:", e);
      }

      if (remoteError && !remoteSaved && token) {
        return { success: false, message: remoteError };
      }

      return { success: true, message: "Address saved successfully." };
    },
    [session]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      const token = session?.accessToken;
      const userId = session?.customer?.id;

      let remoteError = "";
      if (token && !addressId.startsWith("addr_") && !addressId.startsWith("local_")) {
        try {
          const res = await accountService.deleteAddress(token, addressId);
          if (res.errors && Object.keys(res.errors || {}).length > 0) {
            remoteError = fathershopsClient.extractErrorMessage(res.errors) || "Unable to delete address.";
          }
        } catch (err: any) {
          console.warn("[AccountContext] deleteAddress remote error:", err);
        }
      }

      // Remove from local storage
      try {
        const storageKey = token ? getUserAddressesKey(userId) : GUEST_ADDRESSES_STORAGE_KEY;
        const currentRaw = localStorage.getItem(storageKey);
        if (currentRaw) {
          let list: import("../commerce/types").CustomerAddress[] = JSON.parse(currentRaw);
          if (Array.isArray(list)) {
            list = list.filter((a) => a.id !== addressId);
            localStorage.setItem(storageKey, JSON.stringify(list));
          }
        }
      } catch {}

      if (remoteError) {
        return { success: false, message: remoteError };
      }
      return { success: true, message: "Address deleted successfully." };
    },
    [session]
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      const token = session?.accessToken;
      const userId = session?.customer?.id;
      const storageKey = token ? getUserAddressesKey(userId) : GUEST_ADDRESSES_STORAGE_KEY;

      let targetAddr: import("../commerce/types").CustomerAddress | null = null;
      try {
        const currentRaw = localStorage.getItem(storageKey);
        if (currentRaw) {
          const list: import("../commerce/types").CustomerAddress[] = JSON.parse(currentRaw);
          if (Array.isArray(list)) {
            targetAddr = list.find((a) => String(a.id) === String(addressId)) || null;
          }
        }
      } catch {}

      if (targetAddr) {
        const res = await saveAddress({
          ...targetAddr,
          address_id: addressId,
          id: addressId,
          default: "1",
          isDefault: true,
        });
        if (res.success) {
          return { success: true, message: "Default address updated." };
        }
      }

      if (token && !addressId.startsWith("addr_") && !addressId.startsWith("local_")) {
        try {
          await accountService.saveAddress(token, { address_id: addressId, default: "1" });
        } catch {}
      }

      // Update in local storage
      try {
        const currentRaw = localStorage.getItem(storageKey);
        if (currentRaw) {
          let list: import("../commerce/types").CustomerAddress[] = JSON.parse(currentRaw);
          if (Array.isArray(list)) {
            list = list.map((a) => ({
              ...a,
              isDefault: String(a.id) === String(addressId),
            }));
            localStorage.setItem(storageKey, JSON.stringify(list));
          }
        }
      } catch {}

      return { success: true, message: "Default address updated." };
    },
    [session, saveAddress]
  );

  const getWishlist = useCallback(async () => {
    const token = session?.accessToken;
    if (!token) return { products: [], count: 0 };
    try {
      const res = await accountService.getWishlist(token);
      return res.data || { products: [], count: 0 };
    } catch {
      return { products: [], count: 0 };
    }
  }, [session]);

  const toggleWishlist = useCallback(
    async (productId: string, add?: boolean) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to manage your wishlist." };
      }
      try {
        let shouldAdd = add;
        if (shouldAdd === undefined) {
          const currentRes = await accountService.getWishlist(token);
          const currentItems = currentRes.data?.products || [];
          const exists = currentItems.some((p: any) => String(p.product_id || p.id) === String(productId));
          shouldAdd = !exists;
        }

        await accountService.toggleWishlist(token, productId, shouldAdd);
        return {
          success: true,
          message: shouldAdd ? "Product added to wishlist." : "Product removed from wishlist.",
        };
      } catch (err: any) {
        return { success: false, message: err?.message || "Unable to update wishlist." };
      }
    },
    [session]
  );

  const getNewsletter = useCallback(async () => {
    const token = session?.accessToken;
    if (!token) return false;
    try {
      const res = await accountService.getNewsletter(token);
      const val = res.data?.newsletter;
      return val === "1" || val === 1 || String(val) === "true";
    } catch {
      return false;
    }
  }, [session]);

  const updateNewsletter = useCallback(
    async (subscribed: boolean) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to update newsletter preferences." };
      }
      try {
        const res = await accountService.updateNewsletter(token, subscribed);
        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to update newsletter.",
          };
        }
        return { success: true, message: "Newsletter preference updated." };
      } catch (err: any) {
        return { success: false, message: err?.message || "Unable to update newsletter." };
      }
    },
    [session]
  );

  const trackOrder = useCallback(
    async (trackingCode: string) => {
      const email = customer?.email || "";
      try {
        const res = await accountService.trackOrder(trackingCode, email);
        return res.data || null;
      } catch {
        return null;
      }
    },
    [customer]
  );

  return (
    <AccountContext.Provider
      value={{
        customer,
        isAuthenticated: Boolean(session),
        isLoading,
        accessToken: session?.accessToken || null,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        changePassword,
        getOrders,
        getOrderDetail,
        getAddresses,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        getWishlist,
        toggleWishlist,
        getNewsletter,
        updateNewsletter,
        trackOrder,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
