"use client";

import React, { useState } from "react";
import { useAccount } from "@/lib/context/AccountContext";

export const FooterNewsletter: React.FC = () => {
  const { customer, updateNewsletter } = useAccount();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Subscribed to Cosmelia updates.");
        setEmail("");
        if (customer) {
          updateNewsletter(true).catch(() => {});
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Error subscribing.");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 max-w-sm">
      <p className="text-xs text-[#FAF9F6] font-medium tracking-wide">Subscribe to Newsletter</p>
      {status === "success" ? (
        <div className="text-[11px] text-[#81C784] bg-[#81C784]/10 border border-[#81C784]/30 px-3 py-2 rounded-[2px]">
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/15 rounded-[2px] text-white placeholder:text-[#8B92A2] focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#C5A059] text-[#141416] hover:bg-[#D5B88F] rounded-[2px] transition-colors flex-shrink-0 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Join"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-[10px] text-[#E57373]">{message}</p>}
    </div>
  );
};
