"use client";

import React, { useState } from "react";
import Image from "next/image";

/** Shown when a gallery image fails to load or is an SVG placeholder from the CDN */
const GalleryImageFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F4EF] to-[#EAE8E1]">
    <svg className="w-16 h-16 text-[#C5A059]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.75}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  </div>
);

export const ProductGallery: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mainError, setMainError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});

  // Filter out empty strings
  const validImages = images.filter(Boolean);

  if (!validImages || validImages.length === 0) return <GalleryImageFallback />;

  const handleThumbError = (idx: number) => {
    setThumbErrors((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[520px] scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setMainError(false);
              }}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden flex-shrink-0 border transition-all cursor-pointer ${
                activeIdx === idx ? "border-[#141416] ring-1 ring-[#141416]" : "border-[#EAE8E1] hover:border-[#8C734B]"
              }`}
            >
              {thumbErrors[idx] ? (
                <div className="absolute inset-0 bg-[#F5F4EF] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#C5A059]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    />
                  </svg>
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`${name} view ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  onError={() => handleThumbError(idx)}
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-square rounded-sm overflow-hidden bg-white border border-[#EAE8E1] shadow-sm">
        {mainError ? (
          <GalleryImageFallback />
        ) : (
          <Image
            src={validImages[activeIdx] || validImages[0]}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            onError={() => setMainError(true)}
            unoptimized
          />
        )}
      </div>
    </div>
  );
};
