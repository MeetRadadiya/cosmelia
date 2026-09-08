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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof formData, value: string) => {
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
    if (formData.password.length < 6) fe.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm) fe.confirm = "Passwords do not match.";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setLoading(true);
    const result = await register({
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      telephone: formData.telephone.trim() || undefined,
      password: formData.password,
      confirm: formData.confirm,
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
        <Breadcrumbs items={[{ label: "Register Patron Account" }]} />

        <div className="bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-6 mt-6 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Membership
            </span>
            <h1 className="text-2xl font-serif text-[#141416]">Create Patron Profile</h1>
            <p className="text-xs text-[#5E6472]">
              Join the COSMELIA Private Registry for personalized routine monitoring and priority device allocations.
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
              />
              <Input
                label="Last Name"
                required
                autoComplete="family-name"
                value={formData.lastname}
                onChange={(e) => set("lastname", e.target.value)}
                error={fieldErrors.lastname}
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
            />
            <Input
              label="Telephone (optional)"
              type="tel"
              autoComplete="tel"
              value={formData.telephone}
              onChange={(e) => set("telephone", e.target.value)}
              placeholder="+1 (555) 000-0000"
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
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              autoComplete="new-password"
              value={formData.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              error={fieldErrors.confirm}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Establish Profile
            </Button>
          </form>

          <div className="text-center text-xs text-[#5E6472] pt-4 border-t border-[#EAE8E1]">
            <p>
              Already registered?{" "}
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