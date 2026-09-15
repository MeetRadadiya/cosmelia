"use client";

import React, { useState, useEffect } from "react";
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

export const ProductGallery: React.FC<{
  images: string[];
  name: string;
  activeImage?: string;
  onSelectImage?: (url: string) => void;
}> = ({ images, name, activeImage, onSelectImage }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mainError, setMainError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});

  // Filter out empty strings
  const validImages = React.useMemo(() => images.filter(Boolean), [images]);

  // When activeImage prop changes from outside (e.g. color selection), sync activeIdx
  useEffect(() => {
    if (!activeImage) return;

    // Helper to get image filename/path without query params for loose matching
    const getBaseUrl = (url: string) => url.split("?")[0];
    const targetBase = getBaseUrl(activeImage);

    const foundIdx = validImages.findIndex(
      (img) => img === activeImage || getBaseUrl(img) === targetBase
    );

    if (foundIdx !== -1) {
      setActiveIdx(foundIdx);
      setMainError(false);
    }
  }, [activeImage, validImages]);

  if (!validImages || validImages.length === 0) return <GalleryImageFallback />;

  const handleThumbClick = (idx: number) => {
    setActiveIdx(idx);
    setMainError(false);
    if (onSelectImage && validImages[idx]) {
      onSelectImage(validImages[idx]);
    }
  };

  const handleThumbError = (idx: number) => {
    setThumbErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const currentDisplayImage =
    activeImage && (!validImages[activeIdx] || !validImages[activeIdx].includes(activeImage.split("?")[0]))
      ? activeImage
      : validImages[activeIdx] || validImages[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[540px] scrollbar-thin scrollbar-thumb-[#EAE8E1] pr-1 py-0.5">
          {validImages.map((img, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleThumbClick(idx)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xs overflow-hidden flex-shrink-0 border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#141416] ring-2 ring-[#141416]/20 shadow-xs"
                    : "border-[#EAE8E1] hover:border-[#8C734B]"
                }`}
                aria-label={`${name} thumbnail ${idx + 1}`}
              >
                {thumbErrors[idx] ? (
                  <div className="absolute inset-0 bg-[#F5F4EF] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#C5A059]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="object-cover object-center"
                    onError={() => handleThumbError(idx)}
                    unoptimized
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image View */}
      <div className="relative flex-1 aspect-square rounded-sm overflow-hidden bg-white border border-[#EAE8E1] shadow-xs group">
        {mainError ? (
          <GalleryImageFallback />
        ) : (
          <Image
            src={currentDisplayImage}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setMainError(true)}
            unoptimized
          />
        )}

        {/* Gallery Image Counter Badge */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wider pointer-events-none">
            {activeIdx + 1} / {validImages.length}
          </div>
        )}
      </div>
    </div>
  );
};
