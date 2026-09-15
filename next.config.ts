import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // FatherShops CDN returns SVG placeholders when stock images aren't available.
    // We must allow SVG so the optimization pipeline doesn't crash on those responses.
    // The CSP restricts what SVG content can execute to keep this safe.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      // FatherShops CDN — product images from the API
      {
        protocol: "https",
        hostname: "cdn.fathershops.com",
        pathname: "/**",
      },
      // FatherShops store image domains
      {
        protocol: "https",
        hostname: "*.myfathershops.com",
        pathname: "/**",
      },
      // Tenant domain images (getcosmelia.com)
      {
        protocol: "https",
        hostname: "getcosmelia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.getcosmelia.com",
        pathname: "/**",
      },
      // Unsplash editorial imagery
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // FatherStock and dropship image CDNs
      {
        protocol: "https",
        hostname: "cdn.fatherstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fatherstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.aliexpress-media.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.alicdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
