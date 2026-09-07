import { Metadata } from "next";
import Link from "next/link";
import { getCommerceProvider } from "@/lib/commerce";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Patron Account & Orders",
  description: "View your order history, shipping addresses, and personal clinical consultation history.",
};

export default async function AccountPage() {
  const commerce = getCommerceProvider();
  const customer = await commerce.getCustomer("mock-session-token");
  const orders = await commerce.getCustomerOrders("mock-session-token");

  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container">
        <Breadcrumbs items={[{ label: "Patron Account" }]} />

        <div className="py-8 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Client Sanctuary
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#141416]">
            Patron Dashboard
          </h1>
        </div>

        <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416] border-b border-[#EAE8E1] pb-3">
                Patron Information
              </h3>
              <div className="text-xs space-y-1.5 text-[#5E6472]">
                <p className="text-sm font-medium text-[#141416]">
                  {customer?.firstName} {customer?.lastName}
                </p>
                <p>{customer?.email}</p>
                <p>{customer?.phone}</p>
              </div>

              <div className="pt-3 border-t border-[#EAE8E1]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141416] mb-2">
                  Default Delivery Address
                </h4>
                <div className="text-xs text-[#5E6472] leading-relaxed">
                  <p>{customer?.defaultAddress?.address1}</p>
                  <p>
                    {customer?.defaultAddress?.city}, {customer?.defaultAddress?.province}{" "}
                    {customer?.defaultAddress?.zip}
                  </p>
                  <p>{customer?.defaultAddress?.country}</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/account/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Switch Account / Logout
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#EAE8E1] rounded-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
                  Order Manifesto & History
                </h3>
                <span className="text-xs text-[#8B92A2]">{orders.length} orders recorded</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#5E6472] py-8 text-center">No orders recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border border-[#EAE8E1] rounded-sm bg-[#FAF9F6] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#EAE8E1] pb-2">
                        <div className="space-x-2">
                          <span className="font-semibold text-[#141416]">Order {order.orderNumber}</span>
                          <span className="text-[#8B92A2]">• {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-x-2">
                          <span className="px-2 py-0.5 bg-[#EBF1ED] text-[#2D5A43] font-semibold rounded-[2px] uppercase text-[10px]">
                            {order.fulfillmentStatus}
                          </span>
                          <span className="font-semibold text-[#141416]">
                            {formatPrice(order.total, order.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs">
                            <span className="text-[#141416]">
                              {item.name} {item.variantTitle ? `(${item.variantTitle})` : ""} × {item.quantity}
                            </span>
                            <span className="font-medium text-[#141416]">{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
