import React from "react";
import { cn } from "../../lib/utils/format";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider uppercase text-xs";

  const sizeStyles = {
    sm: "px-4 py-2 text-[11px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-xs font-semibold tracking-widest",
  };

  const variantStyles = {
    primary: "bg-[#141416] text-[#FAF9F6] hover:bg-[#2b2d33] shadow-sm hover:shadow active:scale-[0.99]",
    secondary:
      "bg-[#eae8e1] text-[#141416] border border-[#EAE8E1] hover:border-[#141416] hover:bg-[#141416] hover:text-[#FAF9F6]",
    outline: "border border-[#141416] text-[#141416] hover:bg-[#141416] hover:text-[#FAF9F6]",
    ghost: "text-[#141416] hover:bg-[#EAE8E1]/40 border-transparent",
    dark: "bg-[#FFFFFF] text-[#141416] hover:bg-[#EAE8E1] active:scale-[0.99]",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
