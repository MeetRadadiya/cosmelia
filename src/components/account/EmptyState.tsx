import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils/format";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "✦",
  title,
  description,
  action,
  className,
}) => (
  <div className={cn("py-12 text-center bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-4", className)}>
    <div className="w-14 h-14 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8C734B] mx-auto text-xl">
      {icon}
    </div>
    <h3 className="text-lg font-serif text-[#141416]">{title}</h3>
    {description && <p className="text-xs text-[#5E6472] max-w-sm mx-auto leading-relaxed">{description}</p>}
    {action && (
      <div className="pt-2">
        {action.href ? (
          <Link
            href={action.href}
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-wider bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-wider bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    )}
  </div>
);
