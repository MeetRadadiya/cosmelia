"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavConfig } from "@/lib/config/account";
import { AccountIcon } from "./AccountIcon";

function isActive(pathname: string, href: string): boolean {
  if (href === "/account") return pathname === "/account";
  return pathname.startsWith(href);
}

export function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden -mx-5 sm:-mx-8 px-5 sm:px-8">
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[...accountNavConfig.main, ...accountNavConfig.support].map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap rounded-sm border transition-colors flex-shrink-0 ${
                active
                  ? "bg-[#141416] text-[#FAF9F6] border-[#141416]"
                  : "bg-white text-[#5E6472] border-[#EAE8E1] hover:border-[#8C734B] hover:text-[#141416]"
              }`}
            >
              <AccountIcon name={item.icon} className="w-4 h-4 flex-shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
