"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export const MetaPixel: React.FC = () => {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1380047323675399";
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (pixelId && typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "PageView");
      }
    } catch {}
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        onError={() => {
          // Gracefully swallow network block errors from browser adblockers
        }}
        dangerouslySetInnerHTML={{
          __html: `
            try {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              if (window.fbq) {
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              }
            } catch(e) {}
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};
