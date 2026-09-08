"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/context/AccountContext";
import { formatPrice } from "@/lib/utils/format";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { StatusBadge } from "@/components/account/StatusBadge";
import { EmptyState } from "@/components/account/EmptyState";
import { AccountIcon } from "@/components/account/AccountIcon";
import type { Order, CustomerAddress } from "@/lib/commerce/types";

export default function AccountDashboardPage() {
  const { customer, getOrders, getAddresses, refreshProfile } = useAccount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // Refresh profile in background
      refreshProfile().catch(() => {});

      const [orderList, addrList] = await Promise.all([
        getOrders(),
        getAddresses().catch(() => []),
      ]);
      if (mounted) {
        setOrders(orderList);
        setAddresses(addrList);
        setLoadingOrders(false);
        setLoadingAddresses(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [getOrders, getAddresses, refreshProfile]);

  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus !== "fulfilled" && o.financialStatus !== "refunded"
  );
  const orderTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <AccountLayout title="Patron Dashboard" breadcrumbLabel="Account">
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="bg-[#141416] text-[#FAF9F6] rounded-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A880]/10 rounded-full blur-2xl" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            Welcome back
          </span>
          <h2 className="text-2xl md:text-3xl font-serif mt-2">
            {customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Patron" : "Patron"}
          </h2>
          <p className="text-xs text-[#8B92A2] mt-2 max-w-md leading-relaxed">
            Your private COSMELIA sanctuary. View order dispatches, manage your clinical regimen, and track your
            reservations.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon="orders"
            label="Total Orders"
            value={String(orders.length)}
            link="/account/orders"
          />
          <StatCard
            icon="track"
            label="In Dispatch"
            value={String(pendingOrders.length)}
            link="/account/orders"
          />
          <StatCard
            icon="address"
            label="Saved Addresses"
            value={String(addresses.length)}
            link="/account/addresses"
          />
          <StatCard
            icon="profile"
            label="Spend To Date"
            value={formatPrice(orderTotal, "USD")}
            link="/account/orders"
          />
        </div>

        {/* Recent orders */}
        <AccountCard>
          <AccountCardHeader
            title="Recent Orders"
            action={
              orders.length > 0 ? (
                <Link href="/account/orders" className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-medium">
                  View All &rarr;
                </Link>
              ) : undefined
            }
          />
          <AccountCardBody>
            {loadingOrders ? (
              <div className="space-y-4">
                <div className="h-16 bg-[#FAF9F6] animate-pulse rounded" />
                <div className="h-16 bg-[#FAF9F6] animate-pulse rounded" />
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                icon="📦"
                title="No orders yet"
                description="Your order history will appear here once you place your first reservation."
                action={{ label: "Discover The Collection", href: "/products" }}
              />
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block p-4 border border-[#EAE8E1] rounded-sm hover:border-[#8C734B] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#141416]">Order #{order.orderNumber}</span>
                        <span className="text-[#8B92A2]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.fulfillmentStatus} />
                        <span className="font-semibold text-[#141416]">{formatPrice(order.total, order.currency)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-[#5E6472]">
                      {order.items.map((item, idx) => (
                        <span key={item.id}>
                          {idx > 0 && " • "}
                          {item.name.split(" ").slice(0, 4).join(" ")}×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </AccountCardBody>
        </AccountCard>

        {/* Default address + profile quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AccountCard>
            <AccountCardHeader
              title="Default Address"
              action={
                <Link href="/account/addresses" className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-medium">
                  Manage &rarr;
                </Link>
              }
            />
            <AccountCardBody>
              {loadingAddresses ? (
                <div className="h-20 bg-[#FAF9F6] animate-pulse rounded" />
              ) : defaultAddress ? (
                <div className="text-xs text-[#5E6472] leading-relaxed space-y-0.5">
                  <p className="font-medium text-[#141416]">
                    {defaultAddress.firstName} {defaultAddress.lastName}
                  </p>
                  <p>{defaultAddress.address1}</p>
                  {defaultAddress.address2 && <p>{defaultAddress.address2}</p>}
                  <p>
                    {defaultAddress.city}
                    {defaultAddress.province ? `, ${defaultAddress.province}` : ""} {defaultAddress.zip}
                  </p>
                  <p>{defaultAddress.country}</p>
                </div>
              ) : (
                <p className="text-xs text-[#5E6472] py-4">
                  No saved address yet.
                </p>
              )}
            </AccountCardBody>
          </AccountCard>

          <AccountCard>
            <AccountCardHeader
              title="Quick Actions"
              action={
                <Link href="/account/profile" className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-medium">
                  Edit &rarr;
                </Link>
              }
            />
            <AccountCardBody>
              <div className="grid grid-cols-1 gap-2">
                <QuickLink href="/account/profile" icon="profile" label="Edit Profile" />
                <QuickLink href="/account/orders" icon="orders" label="View Orders" />
                <QuickLink href="/account/track" icon="track" label="Track a Shipment" />
                <QuickLink href="/account/wishlist" icon="wishlist" label="View Wishlist" />
              </div>
            </AccountCardBody>
          </AccountCard>
        </div>
      </div>
    </AccountLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  link,
}: {
  icon: string;
  label: string;
  value: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="bg-white border border-[#EAE8E1] rounded-sm p-4 hover:border-[#8C734B] transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm bg-[#F4EEE5] text-[#8C734B] flex items-center justify-center">
          <AccountIcon name={icon} className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-serif font-semibold truncate text-[#141416] group-hover:text-[#8C734B] transition-colors">
            {value}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#8B92A2] font-medium">{label}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-sm border border-[#EAE8E1] text-xs font-medium text-[#141416] hover:border-[#8C734B] hover:text-[#8C734B] transition-colors"
    >
      <AccountIcon name={icon} className="w-4 h-4 text-[#8C734B]" />
      {label}
      <span className="ml-auto text-[#8B92A2]">&rarr;</span>
    </Link>
  );
}
