"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/context/CompareContext";

export const CompareFloatingBar: React.FC = () => {
  const pathname = usePathname();
  const {
    items,
    itemCount,
    maxItems,
    removeFromCompare,
    clearCompare,
    toast,
    clearToast,
    isDockDismissed,
    setIsDockDismissed,
  } = useCompare();

  // Hide the floating bar on the /compare page itself, or if no items are compared
  const isComparePage = pathname === "/compare";

  if (itemCount === 0 || isComparePage) {
    return (
      <>
        {/* Render toast even when floating dock is hidden */}
        {toast && (
          <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#141416] text-[#FAF9F6] px-4 py-3 rounded-sm shadow-xl border border-[#333] flex items-center justify-between gap-3 text-xs animate-slide-in-right">
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={clearToast}
              className="text-white/60 hover:text-white text-base leading-none p-1 cursor-pointer"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#141416] text-[#FAF9F6] px-4 py-3 rounded-sm shadow-xl border border-[#333] flex items-center justify-between gap-3 text-xs animate-slide-in-right">
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={clearToast}
            className="text-white/60 hover:text-white text-base leading-none p-1 cursor-pointer"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Collapsed Pill Button if dismissed */}
      {isDockDismissed ? (
        <button
          type="button"
          onClick={() => setIsDockDismissed(false)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#141416] text-[#FAF9F6] hover:bg-[#252528] border border-[#333] px-3.5 py-2.5 rounded-full shadow-2xl transition-all cursor-pointer text-xs font-medium tracking-wide group"
        >
          <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Compare ({itemCount})</span>
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
        </button>
      ) : (
        /* Full Floating Comparison Dock */
        <div className="fixed bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-2xl bg-[#141416]/95 backdrop-blur-md text-[#FAF9F6] border border-[#2D2D32] rounded-md shadow-2xl p-3 sm:p-3.5 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Left: Previews of Products */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                {items.map((prod) => (
                  <div
                    key={prod.id}
                    className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-xs overflow-hidden bg-white/10 border border-white/20 flex-shrink-0"
                    title={prod.name}
                  >
                    {prod.thumbnail || prod.images?.[0] ? (
                      <Image
                        src={prod.thumbnail || prod.images[0]}
                        alt={prod.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-white/50">
                        N/A
                      </div>
                    )}
                    {/* Remove Overlay Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(prod.id);
                      }}
                      className="absolute inset-0 bg-black/75 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove product"
                      aria-label={`Remove ${prod.name} from comparison`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty Slots Indicator */}
                {Array.from({ length: maxItems - items.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xs border border-dashed border-white/20 flex items-center justify-center text-white/30 text-[10px] flex-shrink-0"
                  >
                    +
                  </div>
                ))}
              </div>

              <div className="hidden md:block pl-1">
                <p className="text-[11px] font-medium tracking-wide text-white/90">
                  {itemCount} of {maxItems} items
                </p>
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer underline"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearCompare}
                className="md:hidden text-[11px] text-white/60 hover:text-white px-2 py-1"
              >
                Clear
              </button>

              <Link
                href="/compare"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#8C734B] hover:bg-[#A38758] text-[#141416] px-4 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Compare Now</span>
                <span className="bg-[#141416]/20 text-[#141416] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {itemCount}
                </span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {/* Minimize Dock */}
              <button
                type="button"
                onClick={() => setIsDockDismissed(true)}
                className="text-white/40 hover:text-white p-1 cursor-pointer transition-colors"
                title="Minimize compare bar"
                aria-label="Minimize compare bar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
