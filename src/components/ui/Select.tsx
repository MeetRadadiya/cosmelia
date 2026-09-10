import React from "react";
import { cn } from "../../lib/utils/format";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  children,
  ...props
}) => {
  const selectId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs uppercase tracking-wider font-medium text-[#141416]/80 flex items-center gap-1"
        >
          <span>{label}</span>
          {props.required && (
            <span className="text-red-500 font-semibold text-sm">*</span>
          )}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full px-4 py-3 h-[46px] text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416] transition-colors duration-200 appearance-none cursor-pointer pr-10",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23141416'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "16px 16px",
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-[#8B92A2]">{helperText}</p>
      )}
    </div>
  );
};
