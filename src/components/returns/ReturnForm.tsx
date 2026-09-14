"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useAccount } from "@/lib/context/AccountContext";
import { accountService } from "@/lib/fathershops/services/accountService";

function ReturnFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { customer, accessToken } = useAccount();

  const paramOrderId = searchParams?.get("order_id") || "";
  const paramProductId = searchParams?.get("product_id") || "";

  const [formData, setFormData] = useState({
    order_id: paramOrderId,
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    product: "",
    code: paramProductId,
    quantity: "1",
    reason_id: "1",
    opened: "0",
    comment: "",
  });

  const [reasons, setReasons] = useState<
    { return_reason_id: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        firstname: prev.firstname || customer.firstName || "",
        lastname: prev.lastname || customer.lastName || "",
        email: prev.email || customer.email || "",
        telephone: prev.telephone || customer.phone || "",
      }));
    }
  }, [customer]);

  useEffect(() => {
    const defaultReasons = [
      { return_reason_id: "1", name: "Received Wrong Item" },
      { return_reason_id: "2", name: "Item Damaged / Defective" },
      { return_reason_id: "3", name: "Order Error" },
      { return_reason_id: "4", name: "Other" },
    ];
    setReasons(defaultReasons);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await accountService.submitReturnRequest(
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          telephone: formData.telephone,
          order_id: formData.order_id,
          product: formData.product,
          model: formData.code,
          quantity: formData.quantity,
          return_reason_id: formData.reason_id,
          opened: formData.opened,
          comment: formData.comment,
        },
        accessToken || undefined,
      );
      if (res.data?.success || res.code === 200 || !res.errors?.length) {
        setSuccessMsg(
          res.data?.message ||
            "Your return request (RMA) has been submitted successfully.",
        );
      } else {
        const err =
          res.errors?.[0] ||
          res.data?.error ||
          "Failed to submit return request.";
        setErrorMsg(typeof err === "string" ? err : JSON.stringify(err));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-10 shadow-2xs">
      {successMsg ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EBF1ED] text-[#2D5A43] flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-serif text-[#141416]">
            Return Request Submitted
          </h2>
          <p className="text-xs text-[#5E6472] max-w-md mx-auto leading-relaxed">
            {successMsg}
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => router.push("/account/orders")}
              className="px-6 py-2.5 bg-[#141416] text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#8C734B] transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-[#FAEEEE] border border-[#B83A3A]/20 rounded-sm text-xs text-[#B83A3A]">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C734B] border-b border-[#EAE8E1] pb-2">
              1. Order & Patron Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="order_id"
                  required
                  value={formData.order_id}
                  onChange={handleChange}
                  placeholder="e.g. 10928"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Telephone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patron@domain.com"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C734B] border-b border-[#EAE8E1] pb-2">
              2. Product & Return Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product"
                  required
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="e.g. Sculpting Gua Sha"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Product Code / SKU
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. PRD-882"
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Reason for Return <span className="text-red-500">*</span>
                </label>
                <select
                  name="reason_id"
                  value={formData.reason_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                >
                  {reasons.length > 0 ? (
                    reasons.map((r) => (
                      <option
                        key={r.return_reason_id}
                        value={r.return_reason_id}
                      >
                        {r.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Received Wrong Item</option>
                      <option value="2">Item Damaged / Defective</option>
                      <option value="3">Order Error</option>
                      <option value="4">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Has Product Been Opened?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#141416] cursor-pointer">
                    <input
                      type="radio"
                      name="opened"
                      value="1"
                      checked={formData.opened === "1"}
                      onChange={handleChange}
                    />
                    <span>Yes, product seal is opened</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#141416] cursor-pointer">
                    <input
                      type="radio"
                      name="opened"
                      value="0"
                      checked={formData.opened === "0"}
                      onChange={handleChange}
                    />
                    <span>No, unopened in original packaging</span>
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141416]/80 mb-1">
                  Fault Details or Comments
                </label>
                <textarea
                  name="comment"
                  rows={3}
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Please describe any defects or details regarding your return..."
                  className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E1] rounded-sm text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#141416] hover:bg-[#8C734B] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Submitting Request..." : "Submit Return Request"}
          </button>
        </form>
      )}
    </div>
  );
}

export function ReturnForm() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#5E6472] bg-white border border-[#EAE8E1]">
          Loading Return Portal...
        </div>
      }
    >
      <ReturnFormContent />
    </Suspense>
  );
}
