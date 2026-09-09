"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { GuestOnlyRoute } from "@/components/account/AccountGuards";
import { useAccount } from "@/lib/context/AccountContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const { login } = useAccount();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      router.push(next);
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-md">
        <Breadcrumbs items={[{ label: "Account Sign In" }]} />

        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 mt-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Welcome Back
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Account Sign In</h1>
            <p className="text-xs text-[#5E6472]">
              Access your account to view order history and shipping status.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@cosmelia.com"
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-end">
              <Link
                href="/account/forgot-password"
                className="text-[11px] text-[#8C734B] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Sign In To Account
            </Button>
          </form>

          <div className="text-center text-xs text-[#5E6472] pt-4 border-t border-[#EAE8E1] space-y-2">
            <p>
              New patron?{" "}
              <Link href="/account/register" className="font-semibold text-[#141416] hover:text-[#8C734B]">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <GuestOnlyRoute>
        <LoginForm />
      </GuestOnlyRoute>
    </Suspense>
  );
}