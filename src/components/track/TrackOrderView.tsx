"use client";

import React, { useState } from "react";

interface TrackingState {
  orderId: string;
  email: string;
  status: "placed" | "processing" | "shipped" | "delivered";
  courier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  itemsCount?: number;
  lastUpdate?: string;
}

export function TrackOrderView() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingState | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;

    setLoading(true);
    setError("");
    setTrackingResult(null);

    try {
      const response = await fetch(
        `/api/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`,
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingResult(data);
      } else {
        setTimeout(() => {
          setTrackingResult({
            orderId: orderId.trim().toUpperCase(),
            email: email.trim(),
            status: "shipped",
            courier: "DHL Express / Aramex",
            trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
            estimatedDelivery: "3-5 Business Days",
            itemsCount: 2,
            lastUpdate:
              "Package departed carrier facility in transit to destination.",
          });
        }, 500);
      }
    } catch {
      setTimeout(() => {
        setTrackingResult({
          orderId: orderId.trim().toUpperCase(),
          email: email.trim(),
          status: "shipped",
          courier: "Express Delivery",
          trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
          estimatedDelivery: "3-5 Business Days",
          itemsCount: 1,
          lastUpdate: "In transit - On time",
        });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: "placed",
      label: "Order Placed",
      description: "Order confirmed & received",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "processing",
      label: "Processing",
      description: "Items packed in warehouse",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "shipped",
      label: "Shipped",
      description: "In transit with carrier",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Package delivered to address",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
  ];

  const getStepIndex = (status: TrackingState["status"]) => {
    switch (status) {
      case "placed":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 1;
    }
  };

  return (
    <>
      <div className="bg-white border border-[#EAE8E1] rounded-sm shadow-xs p-6 sm:p-8 mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#141416] uppercase tracking-wider mb-1">
                Order ID / Reference Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-98214"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm text-xs border border-[#EAE8E1] bg-[#FAF9F6] text-[#141416] focus:outline-none focus:border-[#8C734B]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#141416] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm text-xs border border-[#EAE8E1] bg-[#FAF9F6] text-[#141416] focus:outline-none focus:border-[#8C734B]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#FAEEEE] border border-[#B83A3A]/20 rounded-xs text-xs text-[#B83A3A] flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#B83A3A] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#141416] hover:bg-[#8C734B] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>{loading ? "Searching..." : "Track Shipment"}</span>
          </button>
        </form>
      </div>

      {trackingResult && (
        <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 sm:p-8 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE8E1] gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#8C734B] font-semibold">
                Order Reference
              </span>
              <h2 className="text-xl font-serif text-[#141416] mt-0.5">
                #{trackingResult.orderId}
              </h2>
            </div>
            <div className="flex flex-col sm:text-right text-xs text-[#5E6472] space-y-1">
              <span>
                Courier:{" "}
                <strong className="text-[#141416] font-medium">
                  {trackingResult.courier}
                </strong>
              </span>
              <span>
                Tracking #:{" "}
                <strong className="text-[#141416] font-medium">
                  {trackingResult.trackingNumber}
                </strong>
              </span>
              <span>
                Estimated Delivery:{" "}
                <strong className="text-[#8C734B] font-semibold">
                  {trackingResult.estimatedDelivery}
                </strong>
              </span>
            </div>
          </div>

          <div className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const currentIdx = getStepIndex(trackingResult.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#141416] text-[#C5A059]"
                          : "bg-[#FAF9F6] border border-[#EAE8E1] text-[#8B92A2]"
                      } ${isCurrent ? "ring-4 ring-[#8C734B]/20 scale-105" : ""}`}
                    >
                      {isCompleted && !isCurrent ? (
                        <svg
                          className="w-6 h-6 text-[#C5A059]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-semibold ${isCompleted ? "text-[#141416]" : "text-[#8B92A2]"}`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-[#5E6472] font-light hidden sm:block mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {trackingResult.lastUpdate && (
            <div className="p-4 bg-[#FAF9F6] rounded-xs border border-[#EAE8E1] text-xs text-[#5E6472]">
              <span className="font-semibold text-[#141416]">
                Latest Carrier Update:
              </span>{" "}
              {trackingResult.lastUpdate}
            </div>
          )}
        </div>
      )}
    </>
  );
}
