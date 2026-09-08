import React from "react";
import { cn } from "../../lib/utils/format";

export const AccountCard: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("bg-white border border-[#EAE8E1] rounded-sm", className)}>
    {children}
  </div>
);

export const AccountCardHeader: React.FC<{
  title: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, action, className }) => (
  <div className={cn("flex items-center justify-between border-b border-[#EAE8E1] px-6 py-4", className)}>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">{title}</h3>
    {action}
  </div>
);

export const AccountCardBody: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("p-6", className)}>{children}</div>
);
