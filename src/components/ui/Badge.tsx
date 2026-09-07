import React from "react";
import { cn } from "../../lib/utils/format";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "sale" | "neutral" | "dark";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className,
}) => {
  const variantStyles = {
    primary: "bg-[#F4EEE5] text-[#825E36] border border-[#E8D5C4]",
    secondary: "bg-[#EBF1ED] text-[#2D5A43] border border-[#D0DFD6]",
    sale: "bg-[#FAEEEE] text-[#B83A3A] border border-[#F5D3D3]",
    neutral: "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]",
    dark: "bg-[#1F2228] text-[#FAF9F6] border border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[2px]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
