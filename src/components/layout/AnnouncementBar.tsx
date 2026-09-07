import React from "react";
import { siteConfig } from "../../lib/config/site";
import Link from "next/link";

export const AnnouncementBar: React.FC = () => {
  if (!siteConfig.announcement.enabled) return null;

  return (
    <div className="bg-[#141416] text-[#FAF9F6] text-[11px] font-medium tracking-widest py-2 px-4 text-center border-b border-white/5 uppercase">
      {siteConfig.announcement.link ? (
        <Link
          href={siteConfig.announcement.link}
          className="hover:text-[#C5A880] transition-colors inline-flex items-center gap-1.5"
        >
          <span>{siteConfig.announcement.text}</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span>{siteConfig.announcement.text}</span>
      )}
    </div>
  );
};
