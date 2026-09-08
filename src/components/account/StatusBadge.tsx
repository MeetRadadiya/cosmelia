import React from "react";
import { cn } from "../../lib/utils/format";

type StatusVariant = "fulfilled" | "unfulfilled" | "partial" | "paid" | "pending" | "refunded" | "success" | "warning" | "error" | "neutral";

const variantStyles: Record<StatusVariant, string> = {
  fulfilled: "bg-[#EBF1ED] text-[#2D5A43] border-[#D0DFD6]",
  unfulfilled: "bg-[#FDF3E0] text-[#8C5A2B] border-[#EFDDB8]",
  partial: "bg-[#F4EEE5] text-[#825E36] border-[#E8D5C4]",
  paid: "bg-[#EBF1ED] text-[#2D5A43] border-[#D0DFD6]",
  pending: "bg-[#FDF3E0] text-[#8C5A2B] border-[#EFDDB8]",
  refunded: "bg-[#FAEEEE] text-[#B83A3A] border-[#F5D3D3]",
  success: "bg-[#EBF1ED] text-[#2D5A43] border-[#D0DFD6]",
  warning: "bg-[#FDF3E0] text-[#8C5A2B] border-[#EFDDB8]",
  error: "bg-[#FAEEEE] text-[#B83A3A] border-[#F5D3D3]",
  neutral: "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]",
};

function mapStatus(status: string): { label: string; variant: StatusVariant } {
  const s = status.toLowerCase();
  if (s.includes("complete") || s.includes("fulfilled") || s.includes("delivered")) {
    return { label: "Delivered", variant: "fulfilled" };
  }
  if (s.includes("shipped") || s.includes("in transit") || s.includes("dispatch")) {
    return { label: "Shipped", variant: "success" };
  }
  if (s.includes("processing") || s.includes("proces")) {
    return { label: "Processing", variant: "warning" };
  }
  if (s.includes("pending") || s.includes("waiting")) {
    return { label: "Pending", variant: "pending" };
  }
  if (s.includes("refund") || s.includes("cancelled") || s.includes("cancel")) {
    return { label: "Cancelled", variant: "error" };
  }
  if (s.includes("partial")) {
    return { label: "Partially Delivered", variant: "partial" };
  }
  if (s.includes("paid")) {
    return { label: "Paid", variant: "paid" };
  }
  return { label: status || "Unknown", variant: "neutral" };
}

export const StatusBadge: React.FC<{
  status: string;
  className?: string;
}> = ({ status, className }) => {
  const { label, variant } = mapStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[2px] border",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
};
