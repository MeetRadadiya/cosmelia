"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { EmptyState } from "@/components/account/EmptyState";
import type { CustomerAddress } from "@/lib/commerce/types";

export default function AddressesPage() {
  const { getAddresses } = useAccount();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    getAddresses()
      .then((list) => {
        setAddresses(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [getAddresses]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = () => {
    setShowForm(false);
    setLoading(true);
    load();
  };

  return (
    <AccountLayout title="Addresses" breadcrumbLabel="Addresses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#5E6472]">
            Manage your saved shipping and billing destinations for faster checkout.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ Add Address"}
          </Button>
        </div>

        {showForm && <AddressForm onSuccess={handleSaved} />}

        <AccountCard>
          <AccountCardHeader title={`Saved Addresses (${addresses.length})`} />
          <AccountCardBody>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-32 bg-[#FAF9F6] animate-pulse rounded" />
                <div className="h-32 bg-[#FAF9F6] animate-pulse rounded" />
              </div>
            ) : addresses.length === 0 ? (
              <EmptyState
                icon="📍"
                title="No saved addresses"
                description="Save your shipping detail for a faster, more refined checkout experience."
                action={{ label: "Add Address", onClick: () => setShowForm(true) }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id || addr.address1}
                    className="p-5 border border-[#EAE8E1] rounded-sm relative"
                  >
                    {addr.isDefault && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F4EEE5] text-[#825E36] font-semibold rounded-[2px]">
                        Default
                      </span>
                    )}
                    <p className="font-medium text-sm text-[#141416]">
                      {addr.firstName} {addr.lastName}
                    </p>
                    {addr.company && <p className="text-[11px] text-[#8B92A2]">{addr.company}</p>}
                    <div className="mt-2 text-xs text-[#5E6472] leading-relaxed">
                      <p>{addr.address1}</p>
                      {addr.address2 && <p>{addr.address2}</p>}
                      <p>
                        {addr.city}
                        {addr.province ? `, ${addr.province}` : ""} {addr.zip}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                    {addr.phone && <p className="mt-2 text-[11px] text-[#8B92A2]">{addr.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </AccountCardBody>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}

function AddressForm({ onSuccess }: { onSuccess: () => void }) {
  const { saveAddress } = useAccount();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    postcode: "",
    country_id: "223",
    zone_id: "",
    phone: "",
    default: "1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    if (!form.firstname.trim()) fe.firstname = "Required.";
    if (!form.lastname.trim()) fe.lastname = "Required.";
    if (!form.address_1.trim()) fe.address_1 = "Required.";
    if (!form.city.trim()) fe.city = "Required.";
    if (!form.postcode.trim()) fe.postcode = "Required.";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setLoading(true);
    const payload: Record<string, any> = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      company: form.company.trim() || undefined,
      address_1: form.address_1.trim(),
      address_2: form.address_2.trim() || undefined,
      city: form.city.trim(),
      postcode: form.postcode.trim(),
      country_id: form.country_id || "223",
      zone_id: form.zone_id || undefined,
      telephone: form.phone.trim() || undefined,
      default: form.default,
    };
    const result = await saveAddress(payload);
    setLoading(false);
    if (result.success) {
      await onSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader title="Add New Address" />
      <AccountCardBody>
        {error && (
          <div className="mb-4 p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={form.firstname}
              onChange={(e) => set("firstname", e.target.value)}
              error={fieldErrors.firstname}
            />
            <Input
              label="Last Name"
              required
              value={form.lastname}
              onChange={(e) => set("lastname", e.target.value)}
              error={fieldErrors.lastname}
            />
          </div>
          <Input
            label="Company (optional)"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
          <Input
            label="Address Line 1"
            required
            value={form.address_1}
            onChange={(e) => set("address_1", e.target.value)}
            error={fieldErrors.address_1}
          />
          <Input
            label="Address Line 2 (optional)"
            value={form.address_2}
            onChange={(e) => set("address_2", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              error={fieldErrors.city}
            />
            <Input
              label="Zip / Postcode"
              required
              value={form.postcode}
              onChange={(e) => set("postcode", e.target.value)}
              error={fieldErrors.postcode}
            />
            <Input
              label="Phone (optional)"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>

          {/* State/Province (free text for now) */}
          <Input
            label="State / Province (optional)"
            value={form.zone_id}
            onChange={(e) => set("zone_id", e.target.value)}
            placeholder="e.g. California"
          />

          <label className="flex items-center gap-2 text-xs text-[#5E6472] cursor-pointer">
            <input
              type="checkbox"
              checked={form.default === "1"}
              onChange={(e) => set("default", e.target.checked ? "1" : "0")}
              className="accent-[#141416]"
            />
            Set as default address
          </label>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={loading}>
              Save Address
            </Button>
          </div>
        </form>
      </AccountCardBody>
    </AccountCard>
  );
}