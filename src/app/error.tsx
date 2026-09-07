"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-24 bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center">
      <div className="luxury-container max-w-md text-center space-y-6 bg-white border border-[#EAE8E1] rounded-sm p-10 shadow-sm">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
          Notice
        </span>
        <h1 className="text-3xl font-serif text-[#141416]">System Calibration Required</h1>
        <p className="text-xs text-[#5E6472] leading-relaxed">
          An unexpected interruption occurred while syncing with the commerce protocol. Our aesthetic systems have flagged this instance.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={() => reset()}>
            Recalibrate Session
          </Button>
        </div>
      </div>
    </div>
  );
}
