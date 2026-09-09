"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { GuestOnlyRoute } from "@/components/account/AccountGuards";
import { useAccount } from "@/lib/context/AccountContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const { register } = useAccount();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    password: "",
    confirm: "",
    newsletter: true,
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const fe: Record<string, string> = {};
    if (!formData.firstname.trim()) fe.firstname = "First name is required.";
    if (!formData.lastname.trim()) fe.lastname = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) fe.email = "Enter a valid email address.";

    const cleanTel = formData.telephone.replace(/[^\d+]/g, "");
    if (!cleanTel || cleanTel.length < 10) {
      fe.telephone = "Phone number is required (at least 10 digits).";
    }

    if (formData.password.length < 6) fe.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm) fe.confirm = "Passwords do not match.";
    if (!agreeTerms) fe.agree = "You must agree to the Terms of Service and Privacy Policy.";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setLoading(true);

    const cleanTel = formData.telephone.replace(/[^\d+]/g, "");

    const result = await register({
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      telephone: cleanTel,
      password: formData.password,
      confirm: formData.confirm,
      newsletter: formData.newsletter,
    });
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
        <Breadcrumbs items={[{ label: "Create Account" }]} />

        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 mt-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Membership
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Create Your Account</h1>
            <p className="text-xs text-[#5E6472]">
              Join COSMELIA to easily track your orders, save shipping addresses, and manage your preferences.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                required
                autoComplete="given-name"
                value={formData.firstname}
                onChange={(e) => set("firstname", e.target.value)}
                error={fieldErrors.firstname}
                placeholder="Jane"
              />
              <Input
                label="Last Name"
                required
                autoComplete="family-name"
                value={formData.lastname}
                onChange={(e) => set("lastname", e.target.value)}
                error={fieldErrors.lastname}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => set("email", e.target.value)}
              error={fieldErrors.email}
              placeholder="jane@example.com"
            />
            <Input
              label="Telephone Number"
              type="tel"
              required
              autoComplete="tel"
              value={formData.telephone}
              onChange={(e) => set("telephone", e.target.value)}
              error={fieldErrors.telephone}
              placeholder="e.g. 555-123-4567"
              helperText="Required for delivery tracking updates (10 digits)."
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => set("password", e.target.value)}
              helperText="At least 6 characters."
              error={fieldErrors.password}
              placeholder="••••••••"
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              autoComplete="new-password"
              value={formData.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              error={fieldErrors.confirm}
              placeholder="••••••••"
            />

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-[#5E6472]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#EAE8E1] text-[#141416] focus:ring-[#141416]"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="underline hover:text-[#141416]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" className="underline hover:text-[#141416]">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {fieldErrors.agree && (
                <p className="text-[11px] text-red-600">{fieldErrors.agree}</p>
              )}

              <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-[#5E6472]">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => set("newsletter", e.target.checked)}
                  className="mt-0.5 rounded border-[#EAE8E1] text-[#141416] focus:ring-[#141416]"
                />
                <span>
                  Subscribe to receive beauty tips, routine guides, and exclusive offers.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center text-xs text-[#5E6472] pt-4 border-t border-[#EAE8E1]">
            <p>
              Already have an account?{" "}
              <Link href="/account/login" className="font-semibold text-[#141416] hover:text-[#8C734B]">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <GuestOnlyRoute>
        <RegisterForm />
      </GuestOnlyRoute>
    </Suspense>
  );
}