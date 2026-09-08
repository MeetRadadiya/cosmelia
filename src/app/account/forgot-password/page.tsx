"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { accountService } from "@/lib/fathershops/services/accountService";
import { fathershopsClient } from "@/lib/fathershops/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const res = await accountService.requestPasswordReset(email.trim());
      if (res.errors && Object.keys(res.errors || {}).length > 0) {
        setStatus("error");
        setMessage(fathershopsClient.extractErrorMessage(res.errors));
      } else {
        setStatus("success");
        setMessage(
          "If an account exists for that email, a password reset link has been dispatched to your inbox. Please check your email and follow the instructions."
        );
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-md">
        <Breadcrumbs items={[{ label: "Forgot Password" }]} />

        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 mt-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Account Recovery
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Forgot Password</h1>
            <p className="text-xs text-[#5E6472]">
              Enter the email address associated with your account and we will send you a reset link.
            </p>
          </div>

          {status === "success" && (
            <div className="p-3 bg-[#EBF1ED] border border-[#D0DFD6] text-[#2D5A43] rounded-sm text-xs leading-relaxed">
              {message}
            </div>
          )}
          {status === "error" && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
              {message}
            </div>
          )}

          {status !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@cosmelia.com"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full mt-2"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="text-center text-xs text-[#5E6472] pt-4 border-t border-[#EAE8E1] space-y-2">
            <p>
              Remembered your password?{" "}
              <Link href="/account/login" className="font-semibold text-[#141416] hover:text-[#8C734B]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}