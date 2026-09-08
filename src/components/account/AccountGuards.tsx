"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "@/lib/context/AccountContext";

/**
 * ProtectedRoute
 * Guards a client page against unauthenticated access.
 * Redirects to /account/login with a `next` redirect query parameter.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAccount();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/account/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="py-20 bg-[#FAF9F6] min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-[#EAE8E1] rounded w-1/3 mx-auto" />
          <div className="h-48 bg-[#EAE8E1] rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * GuestOnlyRoute
 * Guards login/register pages so authenticated users are redirected to /account.
 */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAccount();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next || "/account");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
