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
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { firstname?: string; lastname?: string; email?: string; telephone?: string }) => Promise<{ success: boolean; message: string }>;
  changePassword: (password: string, confirm: string) => Promise<{ success: boolean; message: string }>;
  getOrders: () => Promise<import("../commerce/types").Order[]>;
  getOrderDetail: (orderId: string) => Promise<any>;
  getAddresses: () => Promise<import("../commerce/types").CustomerAddress[]>;
  saveAddress: (address: Record<string, any>) => Promise<{ success: boolean; message: string }>;
  getWishlist: () => Promise<any>;
  toggleWishlist: (productId: string) => Promise<{ success: boolean; message: string }>;
  getNewsletter: () => Promise<boolean>;
  updateNewsletter: (subscribed: boolean) => Promise<{ success: boolean; message: string }>;
  trackOrder: (trackingCode: string) => Promise<any>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

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
    const token = session?.accessToken;
    if (!token) return [];
    try {
      const res = await accountService.getOrders(token);
      const rawOrders = res.data?.orders || [];
      return normalizeOrders(rawOrders);
    } catch {
      return [];
    }
  }, [session]);

  const getOrderDetail = useCallback(
    async (orderId: string) => {
      const token = session?.accessToken;
      if (!token) return null;
      try {
        const res = await accountService.getOrderDetail(token, orderId);
        return res.data || null;
      } catch {
        return null;
      }
    },
    [session]
  );

  const getAddresses = useCallback(async () => {
    const token = session?.accessToken;
    if (!token) return [];
    try {
      const res = await accountService.getAddresses(token);
      return normalizeAddresses(res.data);
    } catch {
      return [];
    }
  }, [session]);

  const saveAddress = useCallback(
    async (address: Record<string, any>) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to manage addresses." };
      }
      try {
        const res = await accountService.saveAddress(token, address);
        if (res.errors && Object.keys(res.errors || {}).length > 0) {
          return {
            success: false,
            message: fathershopsClient.extractErrorMessage(res.errors) || "Unable to save address.",
          };
        }
        return { success: true, message: "Address saved successfully." };
      } catch (err: any) {
        return { success: false, message: err?.message || "Unable to save address." };
      }
    },
    [session]
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
    async (productId: string) => {
      const token = session?.accessToken;
      if (!token) {
        return { success: false, message: "You must be signed in to manage your wishlist." };
      }
      try {
        await accountService.toggleWishlist(token, productId, true);
        return { success: true, message: "Product added to wishlist." };
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
