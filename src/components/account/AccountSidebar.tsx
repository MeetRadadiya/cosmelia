"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { accountNavConfig } from "@/lib/config/account";
import { AccountIcon } from "./AccountIcon";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";

function isActive(pathname: string, href: string): boolean {
  if (href === "/account") {
    return pathname === "/account";
  }
  return pathname.startsWith(href);
}

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, logout } = useAccount();

  const handleLogout = async () => {
    await logout();
    router.push("/account/login");
  };

  return (
    <div className="space-y-6">
      {/* Patron card */}
      <div className="bg-white border border-[#EAE8E1] rounded-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#141416] text-[#FAF9F6] flex items-center justify-center font-serif text-lg uppercase">
            {customer?.firstName?.[0] || customer?.email?.[0] || "C"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#141416] truncate">
              {customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Patron" : "Patron"}
            </p>
            <p className="text-[11px] text-[#8B92A2] truncate">{customer?.email}</p>
          </div>
        </div>
      </div>

      {/* Main account nav */}
      <nav aria-label="Account navigation" className="bg-white border border-[#EAE8E1] rounded-sm overflow-hidden">
        <ul className="divide-y divide-[#EAE8E1]/70">
          {accountNavConfig.main.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-colors ${
                    active
                      ? "bg-[#F4EEE5] text-[#141416] border-l-2 border-[#8C734B]"
                      : "text-[#5E6472] hover:bg-[#FAF9F6] hover:text-[#141416] border-l-2 border-transparent"
                  }`}
                >
                  <AccountIcon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Support nav */}
      <nav aria-label="Account support" className="bg-white border border-[#EAE8E1] rounded-sm overflow-hidden">
        <span className="block px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-[#8B92A2] font-semibold">
          Client Concierge
        </span>
        <ul className="divide-y divide-[#EAE8E1]/70">
          {accountNavConfig.support.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                    active
                      ? "bg-[#F4EEE5] text-[#141416] border-l-2 border-[#8C734B]"
                      : "text-[#5E6472] hover:bg-[#FAF9F6] hover:text-[#141416] border-l-2 border-transparent"
                  }`}
                >
                  <AccountIcon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );
}
