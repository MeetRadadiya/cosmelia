"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { accountService } from "@/lib/fathershops/services/accountService";
import { StatusBadge } from "@/components/account/StatusBadge";

interface TrackingResult {
  order_id?: string | number;
  tracking_code?: string;
  carrier?: string;
  status?: string;
  status_text?: string;
  date?: string;
  description?: string;
  history?: Array<{
    date: string;
    status: string;
    location?: string;
    description?: string;
  }>;
}

export default function TrackPage() {
  const { customer } = useAccount();
  return (
    <TrackForm key={customer?.email?.toLowerCase() || "guest"} defaultEmail={customer?.email || ""} />
  );
}

function TrackForm({ defaultEmail }: { defaultEmail: string }) {
  const [trackingCode, setTrackingCode] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = trackingCode.trim();
    const mail = email.trim();

    if (!code) {
      setError("Please enter your tracking number.");
      return;
    }
    if (!mail) {
      setError("Please enter the email used at checkout.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(mail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);
    try {
      const res = await accountService.trackOrder(code, mail);
      if (res.errors && Object.keys(res.errors || {}).length > 0) {
        const msg =
          (res.errors as any)?.en || (res.errors as any)?.warning || "No shipment found for that tracking number.";
        setError(typeof msg === "string" ? msg : "No shipment found for that tracking number.");
        setResult(null);
      } else if (res.data && (res.data.tracking_code || res.data.order_id || res.data.status)) {
        setResult(res.data);
      } else {
        setError("No shipment found for that tracking number. Please check and try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to track your shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-2xl">
        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Shipment Tracking
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Track Your Order</h1>
            <p className="text-xs text-[#5E6472] max-w-sm mx-auto leading-relaxed">
              Enter your tracking number and email to follow the journey of your COSMELIA shipment in real time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tracking Number"
              required
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="e.g. COS-2026-XXXXX"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={defaultEmail || "you@example.com"}
            />
            {error && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
                {error}
              </div>
            )}
            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full mt-2">
              Track Shipment
            </Button>
          </form>

          {result && (
            <div className="pt-4 border-t border-[#EAE8E1] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm">
                <div>
                  <p className="text-sm font-medium text-[#141416]">
                    {result.tracking_code ? `Tracking #${result.tracking_code}` : `Order #${result.order_id}`}
                  </p>
                  <p className="text-[11px] text-[#8B92A2] mt-0.5">
                    {result.carrier ? `Carrier: ${result.carrier}` : "Carrier: UPS"} 
                    {result.date ? ` · ${new Date(result.date).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <StatusBadge status={result.status_text || result.status || "In Transit"} />
              </div>

              {result.description && (
                <p className="text-xs text-[#5E6472] leading-relaxed">{result.description}</p>
              )}

              {result.history && result.history.length > 0 && (
                <div className="space-y-0">
                  {result.history.map((entry, i) => (
                    <div key={i} className="relative pl-6 pb-5 last:pb-0">
                      <span
                        className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ${
                          i === 0 ? "bg-[#8C734B]" : "bg-[#D8D4C8]"
                        }`}
                      />
                      <span className="absolute left-1.25 top-3.5 bottom-0 w-px bg-[#EAE8E1]" />
                      <p className="text-xs font-medium text-[#141416]">
                        {entry.status || "Update"}
                        {entry.location ? ` · ${entry.location}` : ""}
                      </p>
                      <p className="text-[11px] text-[#8B92A2] mt-0.5">
                        {entry.date ? new Date(entry.date).toLocaleString() : ""}
                      </p>
                      {entry.description && (
                        <p className="text-xs text-[#5E6472] mt-1 leading-relaxed">{entry.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(!result.history || result.history.length === 0) && searched && (
                <p className="text-[11px] text-[#8B92A2]">
                  {result.status_text || result.status || "In Transit"} — detailed scan history is not yet available.
                </p>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-[#EAE8E1] text-center">
            <p className="text-[11px] text-[#8B92A2]">
              Having trouble?{" "}
              <Link href="/account/support" className="text-[#8C734B] hover:underline font-medium">
                Contact Our Concierge
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}