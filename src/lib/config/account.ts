export interface AccountNavItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

export const accountNavConfig: {
  main: AccountNavItem[];
  support: AccountNavItem[];
} = {
  main: [
    { title: "Dashboard", href: "/account", icon: "dashboard", description: "Account overview & recent activity" },
    { title: "My Profile", href: "/account/profile", icon: "profile", description: "Personal information & contact details" },
    { title: "My Orders", href: "/account/orders", icon: "orders", description: "Order history & tracking" },
    { title: "Addresses", href: "/account/addresses", icon: "address", description: "Saved shipping & billing addresses" },
    { title: "Wishlist", href: "/account/wishlist", icon: "wishlist", description: "Products saved for later" },
    { title: "Settings", href: "/account/settings", icon: "settings", description: "Account & notification preferences" },
  ],
  support: [
    { title: "Track Order", href: "/account/track", icon: "track", description: "Track a shipment by code" },
    { title: "Help & Support", href: "/account/support", icon: "support", description: "Contact concierge & information" },
  ],
};
