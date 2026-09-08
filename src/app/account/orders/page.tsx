"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/context/AccountContext";
import { formatPrice } from "@/lib/utils/format";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { StatusBadge } from "@/components/account/StatusBadge";
import { EmptyState } from "@/components/account/EmptyState";
import type { Order } from "@/lib/commerce/types";

export default function OrdersPage() {
  const { getOrders } = useAccount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getOrders()
      .then((list) => {
        if (mounted) setOrders(list);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [getOrders]);

  return (
    <AccountLayout title="My Orders" breadcrumbLabel="My Orders">
      <AccountCard>
        <AccountCardHeader
          title={`Order History (${orders.length})`}
          action={
            <Link href="/account/track" className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-medium">
              Track Shipment &rarr;
            </Link>
          }
        />
        <AccountCardBody>
          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-[#FAF9F6] animate-pulse rounded" />
              <div className="h-24 bg-[#FAF9F6] animate-pulse rounded" />
              <div className="h-24 bg-[#FAF9F6] animate-pulse rounded" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No orders yet"
              description="Your order history will appear here once you place your first reservation. Every order includes a 60-day clinical guarantee."
              action={{ label: "Discover The Collection", href: "/products" }}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block p-5 border border-[#EAE8E1] rounded-sm hover:border-[#8C734B] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-serif font-semibold text-[#141416]">
                          Order #{order.orderNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B92A2] mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.orderStatus || order.fulfillmentStatus} />
                      <span className="font-semibold text-[#141416] text-sm">
                        {formatPrice(order.total, order.currency)}
                      </span>
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#EAE8E1] flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="text-[11px] px-2.5 py-1 bg-[#FAF9F6] border border-[#EAE8E1] rounded-sm text-[#5E6472] truncate max-w-[220px]"
                          title={item.name}
                        >
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[11px] px-2.5 py-1 text-[#8B92A2]">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#8B92A2]">
                      {order.paymentMethod
                        ? `Payment: ${order.paymentMethod.replace(/<[^>]*>/g, "")}`
                        : ""}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-[#8C734B] font-medium">
                      View Details &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AccountCardBody>
      </AccountCard>
    </AccountLayout>
  );
}