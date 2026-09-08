"use client";

import React from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { AccountSidebar } from "./AccountSidebar";
import { AccountMobileNav } from "./AccountMobileNav";
import { ProtectedRoute } from "./AccountGuards";

interface AccountLayoutProps {
  title: string;
  eyebrow?: string;
  breadcrumbLabel?: string;
  children: React.ReactNode;
}

export function AccountLayout({
  title,
  eyebrow = "Client Sanctuary",
  breadcrumbLabel,
  children,
}: AccountLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="py-8 bg-[#FAF9F6] min-h-screen">
        <div className="luxury-container">
          <Breadcrumbs items={[{ label: breadcrumbLabel || title }]} />

          <div className="py-8 border-b border-[#EAE8E1] space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              {eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">{title}</h1>
          </div>

          {/* Mobile horizontal nav */}
          <div className="py-4 lg:hidden">
            <AccountMobileNav />
          </div>

          <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <AccountSidebar />
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
