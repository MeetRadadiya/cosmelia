"use client";

import React, { useState } from "react";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import type { Customer } from "@/lib/commerce/types";

export default function ProfilePage() {
  const { customer, updateProfile } = useAccount();

  return (
    <AccountLayout title="My Profile" breadcrumbLabel="My Profile">
      <div className="space-y-6">
        {customer ? (
          <ProfileForm key={customer.id} customer={customer} onUpdate={updateProfile} />
        ) : (
          <div className="h-48 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
        )}
        <PasswordChangeCard />
      </div>
    </AccountLayout>
  );
}

function ProfileForm({
  customer,
  onUpdate,
}: {
  customer: Customer;
  onUpdate: (data: { firstname?: string; lastname?: string; email?: string; telephone?: string }) => Promise<{ success: boolean; message: string }>;
}) {
  const [formData, setFormData] = useState({
    firstname: customer.firstName || "",
    lastname: customer.lastName || "",
    email: customer.email || "",
    telephone: customer.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
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
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess("");
    setError("");
    setLoading(true);
    const result = await onUpdate({
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      telephone: formData.telephone.trim(),
    });
    setLoading(false);
    if (result.success) {
      setSuccess("Your profile information has been updated.");
    } else {
      setError(result.message);
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader title="Personal Information" />
      <AccountCardBody>
        {(success || error) && (
          <div
            className={`mb-4 p-3 rounded-sm text-xs ${
              success ? "bg-[#EBF1ED] border border-[#D0DFD6] text-[#2D5A43]" : "bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24]"
            }`}
          >
            {success || error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Telephone"
            type="tel"
            autoComplete="tel"
            value={formData.telephone}
            onChange={(e) => set("telephone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </AccountCardBody>
    </AccountCard>
  );
}

function PasswordChangeCard() {
  const { changePassword } = useAccount();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (password.length < 6) fe.password = "Password must be at least 6 characters.";
    if (password !== confirm) fe.confirm = "Passwords do not match.";
    setFieldErrors(fe);
    setSuccess("");
    setError("");
    if (Object.keys(fe).length > 0) return;

    setLoading(true);
    const result = await changePassword(password, confirm);
    setLoading(false);
    if (result.success) {
      setSuccess("Your password has been updated.");
      setPassword("");
      setConfirm("");
    } else {
      setError(result.message);
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader title="Change Password" />
      <AccountCardBody>
        {(success || error) && (
          <div
            className={`mb-4 p-3 rounded-sm text-xs ${
              success ? "bg-[#EBF1ED] border border-[#D0DFD6] text-[#2D5A43]" : "bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24]"
            }`}
          >
            {success || error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="At least 6 characters. Use a mix of letters, numbers, and symbols for extra security."
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
          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </AccountCardBody>
    </AccountCard>
  );
}