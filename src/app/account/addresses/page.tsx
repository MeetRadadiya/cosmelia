"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AccountLayout } from "@/components/account/AccountLayout";
import {
  AccountCard,
  AccountCardHeader,
  AccountCardBody,
} from "@/components/account/AccountCard";
import { EmptyState } from "@/components/account/EmptyState";
import { useLocations } from "@/lib/fathershops/hooks/useLocations";
import type { CustomerAddress } from "@/lib/commerce/types";

export default function AddressesPage() {
  const { getAddresses, deleteAddress, setDefaultAddress, isAuthenticated } =
    useAccount();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getAddresses()
      .then((list) => {
        setAddresses(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [getAddresses]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (msg?: string) => {
    setShowForm(false);
    setEditingAddress(null);
    setFeedbackMessage(msg || "Address saved successfully.");
    setFeedbackError(null);
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleStartAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
    setFeedbackMessage(null);
    setFeedbackError(null);
  };

  const handleStartEdit = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setShowForm(true);
    setFeedbackMessage(null);
    setFeedbackError(null);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleDelete = async (addrId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setActionLoadingId(addrId);
    setFeedbackMessage(null);
    setFeedbackError(null);
    try {
      const res = await deleteAddress(addrId);
      if (res.success) {
        setFeedbackMessage("Address deleted successfully.");
        load();
      } else {
        setFeedbackError(res.message);
      }
    } catch (err: any) {
      setFeedbackError(err?.message || "Failed to delete address.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    setActionLoadingId(addrId);
    setFeedbackMessage(null);
    setFeedbackError(null);
    try {
      const res = await setDefaultAddress(addrId);
      if (res.success) {
        setFeedbackMessage("Default address updated.");
        load();
      } else {
        setFeedbackError(res.message);
      }
    } catch (err: any) {
      setFeedbackError(err?.message || "Failed to set default address.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AccountLayout title="Addresses" breadcrumbLabel="Addresses">
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif text-[#141416]">
              Shipping & Billing Destinations
            </h2>
            <p className="text-xs text-[#5E6472] mt-0.5">
              Manage your saved addresses for faster checkout and routine
              deliveries.
            </p>
          </div>
          <Button
            variant={showForm ? "outline" : "primary"}
            size="sm"
            onClick={showForm ? handleCancelForm : handleStartAdd}
            className="self-start sm:self-auto"
          >
            {showForm ? "Cancel" : "+ Add New Address"}
          </Button>
        </div>

        {/* Guest Banner if not signed in */}
        {!isAuthenticated && (
          <div className="p-3.5 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5E6472]">
            <span>
              💡 You are currently managing addresses in local guest mode. Saved
              addresses will be used for rapid checkout on this device.
            </span>
            <Link
              href="/account/login"
              className="text-[#8C734B] font-semibold hover:underline whitespace-nowrap"
            >
              Sign In to Sync &rarr;
            </Link>
          </div>
        )}

        {/* Global Feedback Notifications */}
        {feedbackMessage && (
          <div className="p-3 bg-[#EBF1ED] border border-[#C2D8CA] text-[#2D5A43] rounded-sm text-xs flex items-center justify-between">
            <span>✓ {feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-[#2D5A43] hover:opacity-75 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {feedbackError && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#721C24] rounded-sm text-xs flex items-center justify-between">
            <span>⚠️ {feedbackError}</span>
            <button
              onClick={() => setFeedbackError(null)}
              className="text-[#721C24] hover:opacity-75 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <AddressForm
            initialAddress={editingAddress}
            onSuccess={handleSaved}
            onCancel={handleCancelForm}
          />
        )}

        {/* Saved Addresses List */}
        <AccountCard>
          <AccountCardHeader title={`Saved Addresses (${addresses.length})`} />
          <AccountCardBody>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-36 bg-[#FAF9F6] animate-pulse rounded-sm" />
                <div className="h-36 bg-[#FAF9F6] animate-pulse rounded-sm" />
              </div>
            ) : addresses.length === 0 ? (
              <EmptyState
                icon="📍"
                title="No saved addresses yet"
                description="Save your shipping destination for quick and effortless checkout."
                action={{
                  label: "Add Your First Address",
                  onClick: handleStartAdd,
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isActionLoading = actionLoadingId === addr.id;
                  return (
                    <div
                      key={addr.id || `${addr.address1}_${addr.zip}`}
                      className={`p-5 border rounded-sm relative flex flex-col justify-between transition-all duration-200 bg-white ${
                        addr.isDefault
                          ? "border-[#8C734B]/80 shadow-sm"
                          : "border-[#EAE8E1] hover:border-[#8C734B]/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-[#141416]">
                            {addr.firstName} {addr.lastName}
                          </p>
                          {addr.isDefault && (
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F4EEE5] text-[#825E36] font-semibold rounded-[2px]">
                              Default
                            </span>
                          )}
                        </div>

                        {addr.company && (
                          <p className="text-[11px] text-[#8B92A2] mt-0.5">
                            {addr.company}
                          </p>
                        )}

                        <div className="mt-3 text-xs text-[#5E6472] leading-relaxed space-y-0.5">
                          <p className="text-[#141416] font-medium">
                            {addr.address1}
                          </p>
                          {addr.address2 && <p>{addr.address2}</p>}
                          <p>
                            {addr.city}
                            {addr.province ? `, ${addr.province}` : ""}{" "}
                            {addr.zip}
                          </p>
                          <p className="text-[#8B92A2]">
                            {addr.country || "United States"}
                          </p>
                          {addr.phone && (
                            <p className="pt-1 text-[11px] text-[#8B92A2] font-mono">
                              📞 {addr.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 mt-4 border-t border-[#EAE8E1] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(addr)}
                            disabled={isActionLoading}
                            className="font-medium text-[#141416] hover:text-[#8C734B] transition-colors underline underline-offset-2 cursor-pointer disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(addr.id)}
                            disabled={isActionLoading}
                            className="font-medium text-red-600 hover:text-red-700 transition-colors underline underline-offset-2 cursor-pointer disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>

                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            disabled={isActionLoading}
                            className="text-[11px] uppercase tracking-wider text-[#8C734B] hover:text-[#141416] transition-colors font-semibold cursor-pointer disabled:opacity-50"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AccountCardBody>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}

interface AddressFormProps {
  initialAddress: CustomerAddress | null;
  onSuccess: (message?: string) => void;
  onCancel: () => void;
}

function AddressForm({
  initialAddress,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const { saveAddress } = useAccount();

  const [form, setForm] = useState({
    address_id:
      initialAddress?.id &&
      !initialAddress.id.startsWith("addr_") &&
      !initialAddress.id.startsWith("local_")
        ? initialAddress.id
        : "",
    local_id: initialAddress?.id || "",
    firstname: initialAddress?.firstName || "",
    lastname: initialAddress?.lastName || "",
    company: initialAddress?.company || "",
    address_1: initialAddress?.address1 || "",
    address_2: initialAddress?.address2 || "",
    city: initialAddress?.city || "",
    postcode: initialAddress?.zip || "",
    country_id: initialAddress?.countryId || "223", // Default United States (223)
    zone_id: initialAddress?.zoneId || "",
    provinceText: initialAddress?.province || "",
    phone: initialAddress?.phone || "",
    default: initialAddress?.isDefault ? "1" : "0",
  });

  const {
    countries,
    zones,
    isLoadingCountries,
    isLoadingZones,
    handleCountryChange,
    handleZoneChange,
  } = useLocations(form.country_id || "223");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Sync initial zone when editing or when zones load
  useEffect(() => {
    if (initialAddress?.zoneId) {
      setForm((prev) => ({ ...prev, zone_id: initialAddress.zoneId || "" }));
    }
  }, [initialAddress]);

  useEffect(() => {
    if (zones.length > 0 && !form.zone_id && form.provinceText) {
      const match = zones.find(
        (z) =>
          z.name.toLowerCase() === form.provinceText.toLowerCase() ||
          z.code.toLowerCase() === form.provinceText.toLowerCase()
      );
      if (match) {
        const zid = String(match.zone_id || match.code);
        setForm((prev) => ({ ...prev, zone_id: zid }));
      }
    }
  }, [zones, form.zone_id, form.provinceText]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const onCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setField("country_id", cid);
    setField("zone_id", "");
    setField("provinceText", "");
    handleCountryChange(cid);
  };

  const onZoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zid = e.target.value;
    const matched = zones.find((z) => String(z.zone_id || z.code) === zid);
    setForm((prev) => ({
      ...prev,
      zone_id: zid,
      provinceText: matched?.name || "",
    }));
    handleZoneChange(zid);
  };

  const validate = (): boolean => {
    const fe: Record<string, string> = {};
    if (!form.firstname.trim()) fe.firstname = "First name is required.";
    if (!form.lastname.trim()) fe.lastname = "Last name is required.";
    if (!form.address_1.trim()) fe.address_1 = "Street address is required.";
    if (!form.city.trim()) fe.city = "City is required.";
    if (!form.postcode.trim()) fe.postcode = "Postal / Zip code is required.";
    if (!form.zone_id && !form.provinceText.trim())
      fe.province = "State / Province is required.";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setLoading(true);

    // Find country and zone names for clean display
    const matchedCountry = countries.find(
      (c) => String(c.country_id) === String(form.country_id),
    );
    const matchedZone = zones.find(
      (z) => String(z.zone_id || z.code) === String(form.zone_id),
    );

    const payload: Record<string, any> = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      company: form.company.trim() || undefined,
      address_1: form.address_1.trim(),
      address_2: form.address_2.trim() || undefined,
      city: form.city.trim(),
      postcode: form.postcode.trim(),
      country_id: form.country_id || "223",
      country:
        matchedCountry?.name ||
        (form.country_id === "223" ? "United States" : undefined),
      zone_id: form.zone_id || undefined,
      zone: matchedZone?.name || form.provinceText.trim() || undefined,
      province: matchedZone?.name || form.provinceText.trim() || undefined,
      telephone: form.phone.trim() || undefined,
      default: form.default,
      isDefault: form.default === "1",
    };

    if (form.address_id) {
      payload.address_id = form.address_id;
    }
    if (form.local_id) {
      payload.id = form.local_id;
    }

    try {
      const result = await saveAddress(payload);
      setLoading(false);
      if (result.success) {
        onSuccess(
          initialAddress
            ? "Address updated successfully."
            : "Address added successfully.",
        );
      } else {
        setError(
          result.message || "Unable to save address. Please check your inputs.",
        );
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Unexpected error saving address.");
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader
        title={initialAddress ? "Edit Address" : "Add New Address"}
      />
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
              onChange={(e) => setField("firstname", e.target.value)}
              error={fieldErrors.firstname}
              placeholder="e.g. Jane"
            />
            <Input
              label="Last Name"
              required
              value={form.lastname}
              onChange={(e) => setField("lastname", e.target.value)}
              error={fieldErrors.lastname}
              placeholder="e.g. Doe"
            />
          </div>

          <Input
            label="Company (optional)"
            value={form.company}
            onChange={(e) => setField("company", e.target.value)}
            placeholder="e.g. Suite / Studio"
          />

          <Input
            label="Address Line 1"
            required
            value={form.address_1}
            onChange={(e) => setField("address_1", e.target.value)}
            error={fieldErrors.address_1}
            placeholder="Street address or P.O. Box"
          />

          <Input
            label="Address Line 2 (optional)"
            value={form.address_2}
            onChange={(e) => setField("address_2", e.target.value)}
            placeholder="Apartment, suite, unit, building, floor, etc."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country Selector */}
            <Select
              label="Country"
              required
              value={form.country_id}
              onChange={onCountrySelect}
              disabled={isLoadingCountries}
            >
              {countries.length > 0 ? (
                countries.map((c) => {
                  const cid = String(c.country_id);
                  return (
                    <option key={cid} value={cid}>
                      {c.name}
                    </option>
                  );
                })
              ) : (
                <option value="223">United States</option>
              )}
            </Select>

            {/* State / Province Selector */}
            {isLoadingZones && zones.length === 0 ? (
              <Select label="State / Province" required disabled>
                <option>Loading states / provinces...</option>
              </Select>
            ) : zones.length > 0 ? (
              <Select
                label="State / Province"
                required
                value={form.zone_id}
                onChange={onZoneSelect}
                disabled={isLoadingZones}
                error={fieldErrors.province}
              >
                <option value="">Select State / Province</option>
                {zones.map((z) => {
                  const zid = String(z.zone_id || z.code);
                  return (
                    <option key={zid} value={zid}>
                      {z.name}
                    </option>
                  );
                })}
              </Select>
            ) : (
              <Input
                label="State / Province"
                required
                value={form.provinceText}
                onChange={(e) => setField("provinceText", e.target.value)}
                error={fieldErrors.province}
                placeholder="e.g. California"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              error={fieldErrors.city}
              placeholder="e.g. Los Angeles"
            />
            <Input
              label="Zip / Postcode"
              required
              value={form.postcode}
              onChange={(e) => setField("postcode", e.target.value)}
              error={fieldErrors.postcode}
              placeholder="e.g. 90210"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-[#5E6472] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.default === "1"}
              onChange={(e) =>
                setField("default", e.target.checked ? "1" : "0")
              }
              className="accent-[#141416] w-4 h-4 cursor-pointer"
            />
            <span className="select-none font-medium text-[#141416]">
              Set as default shipping address
            </span>
          </label>

          <div className="pt-3 border-t border-[#EAE8E1] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
            >
              {initialAddress ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      </AccountCardBody>
    </AccountCard>
  );
}
