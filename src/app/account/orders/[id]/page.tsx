"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "@/lib/context/AccountContext";
import { formatPrice, parsePriceLocal } from "@/lib/utils/format";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Button } from "@/components/ui/Button";

interface OrderDetail {
  order_id?: string | number;
  order_number?: string | number;
  date_added?: string;
  payment_method?: string;
  shipping_method?: string;
  total?: string | number;
  currency_code?: string;
  order_status?: string;
  status?: string;
  comment?: string;
  products?: Array<{
    order_product_id?: string | number;
    product_id?: string | number;
    name?: string;
    model?: string;
    quantity?: string | number;
    price?: string | number;
    total?: string | number;
    option?: Array<{ name: string; value: string }>;
    image?: string;
    thumb?: string;
    href?: string;
  }>;
  totals?: Array<{ title?: string; text?: string; value?: string | number; code?: string }>;
  shipping_address?: Record<string, any>;
  payment_address?: Record<string, any>;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  return <OrderDetailContent key={orderId} orderId={orderId} />;
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { getOrderDetail } = useAccount();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOrderDetail(orderId)
      .then((data) => {
        if (!mounted) return;
        if (data && data.products) {
          setOrder(data);
        } else if (data) {
          // Some responses wrap differently
          const inner = data.order || data;
          if (inner && inner.products) {
            setOrder(inner);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (mounted) setNotFound(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [orderId, getOrderDetail]);

  if (loading) {
    return (
      <AccountLayout title="Order Details" breadcrumbLabel="Order Details">
        <div className="space-y-4">
          <div className="h-48 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
          <div className="h-48 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
        </div>
      </AccountLayout>
    );
  }

  if (notFound || !order) {
    return (
      <AccountLayout title="Order Details" breadcrumbLabel="Order Details">
        <div className="py-12 text-center bg-white border border-[#EAE8E1] rounded-sm p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8C734B] mx-auto text-xl">
            ✕
          </div>
          <h3 className="text-lg font-serif text-[#141416]">Order Not Found</h3>
          <p className="text-xs text-[#5E6472]">This order could not be located. It may have been removed or you may not have access to it.</p>
          <div className="pt-2">
            <Link href="/account/orders">
              <Button variant="outline" size="md">Back to Orders</Button>
            </Link>
          </div>
        </div>
      </AccountLayout>
    );
  }

  const products = order.products || [];
  const totals = order.totals || [];
  const currency = order.currency_code || "USD";
  const total = parsePriceLocal(order.total ?? totals.find((t) => t.code === "total")?.value ?? 0);

  return (
    <AccountLayout title={`Order #${order.order_number ?? order.order_id ?? ""}`} breadcrumbLabel="Order Details">
      <div className="space-y-6">
        {/* Order header */}
        <AccountCard>
          <AccountCardHeader
            title={`Order #${order.order_number ?? order.order_id ?? ""}`}
            action={
              <Link href="/account/orders" className="text-xs uppercase tracking-wider text-[#8C734B] hover:underline font-medium">
                &larr; All Orders
              </Link>
            }
          />
          <AccountCardBody>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#5E6472] space-y-1">
                <p>
                  Placed:{" "}
                  <span className="font-medium text-[#141416]">
                    {order.date_added ? new Date(order.date_added).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </span>
                </p>
                {order.shipping_method && (
                  <p>
                    Shipping: <span className="font-medium text-[#141416]">{order.shipping_method.replace(/<[^>]*>/g, "")}</span>
                  </p>
                )}
                {order.payment_method && (
                  <p>
                    Payment: <span className="font-medium text-[#141416]">{order.payment_method.replace(/<[^>]*>/g, "")}</span>
                  </p>
                )}
              </div>
              <div className="text-right space-y-2">
                <StatusBadge status={order.order_status || order.status || "Processing"} />
                <p className="text-xl font-serif font-semibold text-[#141416]">
                  {formatPrice(total, currency)}
                </p>
              </div>
            </div>
          </AccountCardBody>
        </AccountCard>

        {/* Items */}
        <AccountCard>
          <AccountCardHeader title="Items Purchased" />
          <AccountCardBody>
            <div className="divide-y divide-[#EAE8E1]">
              {products.map((item) => {
                const optionText = Array.isArray(item.option) && item.option.length > 0
                  ? item.option.map((o) => `${o.name}: ${o.value}`).join(", ")
                  : undefined;
                return (
                  <div key={item.order_product_id ?? item.product_id} className="py-4 flex flex-col sm:flex-row gap-4">
                    <div className="w-20 h-20 bg-[#FAF9F6] rounded-sm border border-[#EAE8E1] flex-shrink-0 overflow-hidden">
                      {item.image || item.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image || item.thumb}
                          alt={item.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8C734B]/50 text-xl">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#141416]">{item.name}</p>
                      {item.model && <p className="text-[11px] text-[#8B92A2]">SKU: {item.model}</p>}
                      {optionText && <p className="text-[11px] text-[#8C734B] mt-1">{optionText}</p>}
                      <p className="text-xs text-[#5E6472] mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#141416]">
                        {formatPrice(parsePriceLocal(item.total ?? item.price ?? 0), currency)}
                      </p>
                      <p className="text-[11px] text-[#8B92A2]">
                        {formatPrice(parsePriceLocal(item.price ?? 0), currency)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccountCardBody>
        </AccountCard>

        {/* Totals + addresses */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <AccountCard>
              <AccountCardHeader title="Order Summary" />
              <AccountCardBody>
                <div className="space-y-2.5 text-xs">
                  {totals.map((t) => (
                    <div key={t.code || t.title} className="flex justify-between text-[#5E6472]">
                      <span>{(t.title || "").replace(/<[^>]*>/g, "")}</span>
                      <span className="font-medium text-[#141416]">{t.text || formatPrice(parsePriceLocal(t.value ?? 0), currency)}</span>
                    </div>
                  ))}
                  {totals.length === 0 && (
                    <div className="flex justify-between font-semibold text-[#141416]">
                      <span>Total</span>
                      <span>{formatPrice(total, currency)}</span>
                    </div>
                  )}
                </div>
              </AccountCardBody>
            </AccountCard>
          </div>

          <div className="md:col-span-7">
            <AccountCard>
              <AccountCardHeader title="Shipping Address" />
              <AccountCardBody>
                {order.shipping_address ? (
                  <div className="text-xs text-[#5E6472] leading-relaxed space-y-0.5">
                    <p className="font-medium text-[#141416]">
                      {order.shipping_address.firstname || ""} {order.shipping_address.lastname || ""}
                    </p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>
                      {order.shipping_address.city}
                      {order.shipping_address.zone && `, ${order.shipping_address.zone}`} {order.shipping_address.postcode}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#5E6472]">No shipping address recorded.</p>
                )}
              </AccountCardBody>
            </AccountCard>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}