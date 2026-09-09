"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";

export default function SettingsPage() {
  const { customer, getNewsletter, updateNewsletter, logout } = useAccount();
  const router = useRouter();

  const [newsletter, setNewsletter] = useState(false);
  const [loadingNewsletter, setLoadingNewsletter] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getNewsletter()
      .then(setNewsletter)
      .catch(() => {});
  }, [getNewsletter]);

  const handleNewsletterToggle = async () => {
    setLoadingNewsletter(true);
    setNewsletterStatus(null);
    const next = !newsletter;
    setNewsletter(next);
    const result = await updateNewsletter(next);
    setLoadingNewsletter(false);
    setNewsletterStatus(result);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/account/login");
  };

  return (
    <AccountLayout title="Account Settings" breadcrumbLabel="Settings">
      <div className="space-y-6">
        {/* Newsletter */}
        <AccountCard>
          <AccountCardHeader title="Communication Preferences" />
          <AccountCardBody>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-[#141416]">Beauty Updates &amp; Special Offers</p>
                <p className="text-xs text-[#5E6472] mt-1 leading-relaxed">
                  Receive curated self-care tips, new product arrivals, and subscriber-only promotions.
                  Your details are never shared with third parties.
                </p>
              </div>
              <button
                onClick={handleNewsletterToggle}
                disabled={loadingNewsletter}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  newsletter ? "bg-[#141416]" : "bg-[#EAE8E1]"
                }`}
                aria-label="Toggle newsletter subscription"
                aria-pressed={newsletter}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    newsletter ? "left-6.5" : "left-0.5"
                  }`}
                  style={newsletter ? { left: "calc(100% - 22px)" } : undefined}
                />
              </button>
            </div>
            {newsletterStatus && (
              <p
                className={`mt-3 text-xs ${
                  newsletterStatus.success ? "text-[#2D5A43]" : "text-[#B33A3A]"
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
          </AccountCardBody>
        </AccountCard>

        {/* Account info */}
        <AccountCard>
          <AccountCardHeader title="Account Information" />
          <AccountCardBody>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <dt className="text-[#8B92A2] uppercase tracking-wider text-[10px] mb-1">Name</dt>
                <dd className="font-medium text-[#141416]">
                  {customer ? `${customer.firstName} ${customer.lastName}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[#8B92A2] uppercase tracking-wider text-[10px] mb-1">Email</dt>
                <dd className="font-medium text-[#141416]">{customer?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8B92A2] uppercase tracking-wider text-[10px] mb-1">Telephone</dt>
                <dd className="font-medium text-[#141416]">{customer?.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8B92A2] uppercase tracking-wider text-[10px] mb-1">Status</dt>
                <dd className="font-medium">
                  <span className="text-[#2D5A43] bg-[#EBF1ED] px-2 py-0.5 rounded-[2px] uppercase text-[10px] tracking-wider">
                    Active Patron
                  </span>
                </dd>
              </div>
            </dl>
            <div className="pt-4 mt-4 border-t border-[#EAE8E1]">
              <Button variant="outline" size="sm" onClick={() => router.push("/account/profile")}>
                Edit Profile
              </Button>
            </div>
          </AccountCardBody>
        </AccountCard>

        {/* Session / Logout */}
        <AccountCard>
          <AccountCardHeader title="Session" />
          <AccountCardBody>
            <p className="text-xs text-[#5E6472] leading-relaxed mb-4">
              Signing out ends your current session on this device. Your cart and order history will be
              restored when you sign back in.
            </p>
            {confirmLogout ? (
              <div className="flex flex-wrap items-center gap-3 p-4 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm">
                <p className="text-xs text-[#5E6472] mr-auto">Are you sure you want to sign out?</p>
                <Button variant="primary" size="sm" isLoading={loggingOut} onClick={handleLogout}>
                  Yes, Sign Out
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmLogout(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirmLogout(true)}>
                Sign Out
              </Button>
            )}
          </AccountCardBody>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}