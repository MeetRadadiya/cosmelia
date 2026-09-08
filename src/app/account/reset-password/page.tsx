"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { accountService } from "@/lib/fathershops/services/accountService";
import { fathershopsClient } from "@/lib/fathershops/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate the reset code on mount
  useEffect(() => {
    let mounted = true;
    async function checkCode() {
      if (!code) {
        if (mounted) {
          setInvalid(true);
          setValidating(false);
        }
        return;
      }
      try {
        const res = await accountService.validateResetCode(code);
        const hasError =
          res.errors && Object.keys(res.errors || {}).length > 0;
        const dataError = res.data?.error;
        if (mounted) {
          if (hasError || dataError) {
            setInvalid(true);
          }
          setValidating(false);
        }
      } catch {
        if (mounted) {
          setInvalid(true);
          setValidating(false);
        }
      }
    }
    checkCode();
    return () => {
      mounted = false;
    };
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (password.length < 6) fe.password = "Password must be at least 6 characters.";
    if (password !== confirm) fe.confirm = "Passwords do not match.";
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await accountService.resetPassword(code, password, confirm);
      if (res.errors && Object.keys(res.errors || {}).length > 0) {
        setStatus("error");
        setMessage(fathershopsClient.extractErrorMessage(res.errors) || "Unable to reset your password.");
      } else {
        setStatus("success");
        setMessage("Your password has been reset successfully. You can now sign in with your new password.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Unable to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-md">
        <Breadcrumbs items={[{ label: "Reset Password" }]} />

        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 mt-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              New Credentials
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Reset Password</h1>
          </div>

          {validating ? (
            <div className="py-10 text-center">
              <svg className="animate-spin h-6 w-6 text-[#8C734B] mx-auto" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-xs text-[#5E6472] mt-3">Verifying your reset code...</p>
            </div>
          ) : invalid ? (
            <div className="space-y-4 text-center py-4">
              <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
                This password reset link is invalid or has already been used. Please request a new one.
              </div>
              <div className="pt-2">
                <Link href="/account/forgot-password">
                  <Button variant="primary" size="md" className="w-full">
                    Request New Link
                  </Button>
                </Link>
              </div>
            </div>
          ) : status === "success" ? (
            <div className="space-y-4 text-center py-4">
              <div className="p-3 bg-[#EBF1ED] border border-[#D0DFD6] text-[#2D5A43] rounded-sm text-xs">
                {message}
              </div>
              <div className="pt-2">
                <Link href="/account/login">
                  <Button variant="primary" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
                  {message}
                </div>
              )}
              <Input
                label="New Password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="At least 6 characters."
                error={fieldErrors.password}
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={fieldErrors.confirm}
              />
              <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full mt-2">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}