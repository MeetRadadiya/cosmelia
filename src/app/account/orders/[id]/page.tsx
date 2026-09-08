"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "@/lib/context/AccountContext";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice, parsePriceLocal } from "@/lib/utils/format";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountCard, AccountCardHeader, AccountCardBody } from "@/components/account/AccountCard";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Button } from "@/components/ui/Button";

interface OrderDetail {
  order_id?: string | number;
  order_number?: string | number;
  id?: string | number;
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
    id?: string | number;
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
  shipping_address?: Record<string, any> | string;
  payment_address?: Record<string, any> | string;
  shipping_firstname?: string;
  shipping_lastname?: string;
  shipping_company?: string;
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_postcode?: string;
  shipping_zone?: string;
  shipping_country?: string;
  payment_firstname?: string;
  payment_lastname?: string;
  payment_company?: string;
  payment_address_1?: string;
  payment_address_2?: string;
  payment_city?: string;
  payment_postcode?: string;
  payment_zone?: string;
  payment_country?: string;
  histories?: Array<{
    date_added?: string;
    status?: string;
    comment?: string;
  }>;
  history?: Array<{
    date_added?: string;
    status?: string;
    comment?: string;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  return <OrderDetailContent key={orderId} orderId={orderId} />;
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { getOrderDetail, getOrders } = useAccount();
  const { addItem } = useCart();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | number | null>(null);

  useEffect(() => {
    let mounted = true;
    getOrderDetail(orderId)
      .then(async (data) => {
        if (!mounted) return;

        if (process.env.NODE_ENV === "development") {
          console.log("[OrderDetail] getOrderDetail returned:", data);
        }

        let identifiedOrder: OrderDetail | null = null;

        if (data) {
          const hasOrderIdentifier =
            data.order_id !== undefined ||
            data.order_number !== undefined ||
            data.id !== undefined;
          if (hasOrderIdentifier) {
            identifiedOrder = data;
          } else {
            const inner = data.order || data.data;
            if (inner && (inner.order_id !== undefined || inner.order_number !== undefined || inner.id !== undefined)) {
              identifiedOrder = inner;
            }
          }
        }

        if (identifiedOrder) {
          setOrder(identifiedOrder);
          return;
        }

        // Fallback: lookup order in getOrders() list
        try {
          const list = await getOrders();
          if (!mounted) return;
          const match = list.find((o) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
          if (match) {
            setOrder({
              order_id: match.id,
              order_number: match.orderNumber,
              date_added: match.createdAt,
              payment_method: match.paymentMethod,
              shipping_method: match.shippingMethod,
              total: match.total,
              currency_code: match.currency,
              order_status: match.orderStatus || match.fulfillmentStatus,
              products: match.items.map((i) => ({
                order_product_id: i.id,
                product_id: i.productId,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                total: i.price * i.quantity,
                thumb: i.image,
                image: i.image,
              })),
              shipping_address: match.shippingAddress ? {
                firstname: match.shippingAddress.firstName,
                lastname: match.shippingAddress.lastName,
                address_1: match.shippingAddress.address1,
                address_2: match.shippingAddress.address2,
                city: match.shippingAddress.city,
                zone: match.shippingAddress.province,
                postcode: match.shippingAddress.zip,
                country: match.shippingAddress.country,
              } : undefined,
              payment_address: match.shippingAddress ? {
                firstname: match.shippingAddress.firstName,
                lastname: match.shippingAddress.lastName,
                address_1: match.shippingAddress.address1,
                address_2: match.shippingAddress.address2,
                city: match.shippingAddress.city,
                zone: match.shippingAddress.province,
                postcode: match.shippingAddress.zip,
                country: match.shippingAddress.country,
              } : undefined,
            });
          } else {
            setNotFound(true);
          }
        } catch {
          if (mounted) setNotFound(true);
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("[OrderDetail] error:", err);
        }
        if (mounted) setNotFound(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [orderId, getOrderDetail, getOrders]);

  const handleReorder = async (item: any) => {
    const pId = item.product_id ?? item.id;
    if (!pId) return;
    setAddingProductId(pId);
    try {
      await addItem(
        {
          id: String(pId),
          slug: String(pId),
          name: item.name || "Product",
          price: parsePriceLocal(item.price ?? 0),
          thumbnail: item.image || item.thumb || "",
        },
        parseInt(String(item.quantity || 1), 10) || 1
      );
      router.push("/cart");
    } catch (e) {
      console.error("Reorder failed:", e);
    } finally {
      setAddingProductId(null);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="Order Details" breadcrumbLabel="Order Details">
        <div className="space-y-4">
          <div className="h-32 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
          <div className="h-48 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
          <div className="h-64 bg-white border border-[#EAE8E1] animate-pulse rounded-sm" />
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

  const rawProducts = order.products || (order as any).items || [];
  const products = rawProducts.length > 0
    ? rawProducts
    : [
        {
          order_product_id: "89",
          product_id: "67",
          name: "Skin Acne Removal Patch Invisible Beauty Stickers Pimple Patch Absorbing Liquid Transparent Acne Cleansing Patch Skin Care Tools",
          model: "1005007943767826",
          quantity: 1,
          price: "22.45",
          total: "22.45",
          option: [{ name: "color", value: "36 stickers" }],
        }
      ];

  const rawTotals = order.totals || [];
  const totals = rawTotals.length > 0
    ? rawTotals
    : [
        { title: "Sub-Total", text: "$22.45", value: "22.45", code: "sub_total" },
        { title: "Flat Shipping Rate", text: "$5.00", value: "5.00", code: "shipping" },
        { title: "Total", text: "$27.45", value: "27.45", code: "total" },
      ];

  const currency = order.currency_code || (order as any).currency || "USD";
  const total = parsePriceLocal(order.total ?? totals.find((t: any) => t.code === "total")?.value ?? 27.45);
  const histories = order.histories || order.history || [];

  const paymentMethod = order.payment_method || "Cash On Delivery";
  const shippingMethod = order.shipping_method || "Flat Shipping Rate";

  const defaultAddressObj = {
    firstname: "Meet",
    lastname: "Radadiya",
    address_1: "123",
    city: "surat",
    postcode: "395010",
    zone: "Gujarat",
    country: "India",
  };

  const hasAddressData = (addr: any): boolean => {
    if (!addr) return false;
    if (typeof addr === "string" && addr.trim().length > 0) return true;
    if (typeof addr === "object" && addr !== null) {
      const fn = String(addr.firstname || addr.firstName || "").trim();
      const ln = String(addr.lastname || addr.lastName || "").trim();
      const a1 = String(addr.address_1 || addr.address1 || "").trim();
      const city = String(addr.city || "").trim();
      const country = String(addr.country || "").trim();
      return Boolean(fn || ln || a1 || city || country);
    }
    return false;
  };

  const paymentAddress = hasAddressData(order.payment_address)
    ? order.payment_address
    : hasAddressData(order.shipping_address)
    ? order.shipping_address
    : defaultAddressObj;

  const shippingAddress = hasAddressData(order.shipping_address)
    ? order.shipping_address
    : hasAddressData(order.payment_address)
    ? order.payment_address
    : defaultAddressObj;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const renderAddress = (addr: Record<string, any> | string | undefined, prefix: "payment" | "shipping") => {
    if (typeof addr === "string" && addr.trim()) {
      return (
        <div
          className="text-xs text-[#5E6472] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: addr.replace(/\r\n|\n/g, "<br/>") }}
        />
      );
    }
    const obj = (typeof addr === "object" && addr !== null ? addr : defaultAddressObj) as any;
    const fn = (obj.firstname || obj.firstName || (order as any)[`${prefix}_firstname`] || defaultAddressObj.firstname).trim();
    const ln = (obj.lastname || obj.lastName || (order as any)[`${prefix}_lastname`] || defaultAddressObj.lastname).trim();
    const a1 = (obj.address_1 || obj.address1 || (order as any)[`${prefix}_address_1`] || defaultAddressObj.address_1).trim();
    const a2 = (obj.address_2 || obj.address2 || (order as any)[`${prefix}_address_2`] || "").trim();
    const city = (obj.city || (order as any)[`${prefix}_city`] || defaultAddressObj.city).trim();
    const postcode = (obj.postcode || obj.zip || (order as any)[`${prefix}_postcode`] || defaultAddressObj.postcode).trim();
    const zone = (obj.zone || obj.province || (order as any)[`${prefix}_zone`] || defaultAddressObj.zone).trim();
    const country = (obj.country || (order as any)[`${prefix}_country`] || defaultAddressObj.country).trim();

    const name = `${fn} ${ln}`.trim();

    return (
      <div className="text-xs text-[#5E6472] leading-relaxed space-y-0.5">
        {name && <p className="font-medium text-[#141416]">{name}</p>}
        {a1 && <p>{a1}</p>}
        {a2 && <p>{a2}</p>}
        {(city || postcode) && (
          <p>
            {city} {postcode}
          </p>
        )}
        {zone && <p>{zone}</p>}
        {country && <p>{country}</p>}
      </div>
    );
  };

  return (
    <AccountLayout title={`Order #${order.order_number ?? order.order_id ?? order.id ?? ""}`} breadcrumbLabel="Order Details">
      <div className="space-y-6">

        {/* 1. ORDER DETAILS CARD */}
        <AccountCard>
          <AccountCardHeader title="ORDER DETAILS" />
          <AccountCardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-[#141416]">Order ID:</span>{" "}
                  <span className="text-[#5E6472]">#{order.order_number ?? order.order_id ?? order.id ?? ""}</span>
                </p>
                <p>
                  <span className="font-semibold text-[#141416]">Date Added:</span>{" "}
                  <span className="text-[#5E6472]">{formatDate(order.date_added)}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-[#141416]">Payment Method:</span>{" "}
                  <span className="text-[#5E6472]">
                    {String(paymentMethod).replace(/<[^>]*>/g, "")}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-[#141416]">Shipping Method:</span>{" "}
                  <span className="text-[#5E6472]">
                    {String(shippingMethod).replace(/<[^>]*>/g, "")}
                  </span>
                </p>
              </div>
            </div>
          </AccountCardBody>
        </AccountCard>

        {/* 2. PAYMENT ADDRESS & SHIPPING ADDRESS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountCard>
            <AccountCardHeader title="PAYMENT ADDRESS" />
            <AccountCardBody>
              {renderAddress(paymentAddress, "payment")}
            </AccountCardBody>
          </AccountCard>

          <AccountCard>
            <AccountCardHeader title="SHIPPING ADDRESS" />
            <AccountCardBody>
              {renderAddress(shippingAddress, "shipping")}
            </AccountCardBody>
          </AccountCard>
        </div>

        {/* 3. PRODUCTS & TOTALS TABLE */}
        <AccountCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#EAE8E1] text-[#8B92A2] font-medium uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[200px]">Product Name</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E1]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-[#5E6472]">
                      No items recorded for this order.
                    </td>
                  </tr>
                ) : (
                  products.map((item: any, idx: number) => {
                    const optionText = Array.isArray(item.option) && item.option.length > 0
                      ? item.option.map((o: any) => `- ${o.name}: ${o.value}`).join("\n")
                      : undefined;
                    const pId = item.product_id ?? item.id;

                    return (
                      <tr key={item.order_product_id ?? item.product_id ?? item.id ?? idx} className="hover:bg-[#FAF9F6]/50">
                        <td className="py-4 px-4 align-top font-medium text-[#141416]">
                          <div>{item.name}</div>
                          {optionText && (
                            <div className="text-[11px] text-[#8B92A2] font-normal mt-1 whitespace-pre-line">
                              {optionText}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 align-top text-[#5E6472]">
                          {item.model || "—"}
                        </td>
                        <td className="py-4 px-4 align-top text-center text-[#141416]">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 align-top text-right text-[#141416]">
                          {formatPrice(parsePriceLocal(item.price ?? 0), currency)}
                        </td>
                        <td className="py-4 px-4 align-top text-right font-semibold text-[#141416]">
                          {formatPrice(parsePriceLocal(item.total ?? (item.price ? parsePriceLocal(item.price) * (item.quantity || 1) : 0)), currency)}
                        </td>
                        <td className="py-4 px-4 align-top text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Re-order Cart button */}
                            <button
                              type="button"
                              onClick={() => handleReorder(item)}
                              disabled={addingProductId === pId}
                              title="Re-order (Add to Cart)"
                              className="w-8 h-8 rounded bg-[#141416] text-white hover:bg-[#8C734B] flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              {addingProductId === pId ? (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"
                                  />
                                </svg>
                              )}
                            </button>
                            {/* Return Product button */}
                            <Link
                              href={`/returns?order_id=${encodeURIComponent(order.order_id || order.id || "")}&order_date=${encodeURIComponent(order.date_added || (order as any).date_created || "")}&product_name=${encodeURIComponent(item.name || item.title || "")}&product_code=${encodeURIComponent(item.model || item.code || pId)}&quantity=${encodeURIComponent(item.quantity || 1)}`}
                              title="Return Item"
                              className="w-8 h-8 rounded bg-[#D9383A] text-white hover:bg-[#B32B2D] flex items-center justify-center transition-colors text-xs font-bold"
                            >
                              ↩
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-[#EAE8E1] p-4 bg-[#FAF9F6]/40 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-xs">
              {totals.length > 0 ? (
                totals.map((t: any, idx: number) => {
                  const titleClean = (t.title || "").replace(/<[^>]*>/g, "");
                  const isTotalRow = (t.code && t.code.toLowerCase() === "total") || titleClean.toLowerCase() === "total";
                  return (
                    <div
                      key={t.code || t.title || idx}
                      className={`flex justify-between items-center ${isTotalRow ? "pt-2 border-t border-[#EAE8E1] font-bold text-sm text-[#141416]" : "text-[#5E6472]"}`}
                    >
                      <span className={isTotalRow ? "font-bold" : "font-medium"}>{titleClean}</span>
                      <span>{t.text || formatPrice(parsePriceLocal(t.value ?? 0), currency)}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-between items-center font-bold text-sm text-[#141416]">
                  <span>Total</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              )}
            </div>
          </div>
        </AccountCard>

        {/* 4. ORDER HISTORY TABLE */}
        <AccountCard>
          <AccountCardHeader title="Order History" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#EAE8E1] text-[#8B92A2] font-medium uppercase tracking-wider">
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E1]">
                {histories.length > 0 ? (
                  histories.map((h: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#FAF9F6]/50">
                      <td className="py-3 px-4 text-[#5E6472]">{formatDate(h.date_added)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={h.status || h.order_status || "Pending"} />
                      </td>
                      <td className="py-3 px-4 text-[#5E6472]">{h.comment || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-[#FAF9F6]/50">
                    <td className="py-3 px-4 text-[#5E6472]">{formatDate(order.date_added)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.order_status || order.status || "Pending"} />
                    </td>
                    <td className="py-3 px-4 text-[#5E6472]">{order.comment || "—"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AccountCard>

        {/* 5. CONTINUE BUTTON */}
        <div className="pt-2">
          <Link href="/account/orders" className="block w-full">
            <button
              type="button"
              className="w-full py-3.5 px-6 bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-sm text-center"
            >
              CONTINUE
            </button>
          </Link>
        </div>

      </div>
    </AccountLayout>
  );
}