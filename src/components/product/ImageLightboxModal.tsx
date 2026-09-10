"use client";

import React, { useState, useEffect } from "react";

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Top Bar: Counter & Close Button */}
      <div className="w-full max-w-5xl flex items-center justify-between text-white z-10 py-2">
        <span className="text-xs uppercase tracking-widest font-mono text-[#EAE8E1]/80">
          Photo {currentIndex + 1} of {images.length}
        </span>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Center Image Container with Navigation Arrows */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center p-2 sm:p-4 my-auto">
        {/* Prev Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 bg-black/60 hover:bg-black text-white border border-white/20 rounded-full transition-all hover:scale-105 cursor-pointer shadow-xl backdrop-blur-xs"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Main Image */}
        <div
          className="relative max-w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-sm border border-white/10 shadow-2xl bg-black/40"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage}
            alt={`Customer review enlarged photo ${currentIndex + 1}`}
            className="max-w-full max-h-[75vh] object-contain transition-all duration-300 animate-fade-in"
          />
        </div>

        {/* Next Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 bg-black/60 hover:bg-black text-white border border-white/20 rounded-full transition-all hover:scale-105 cursor-pointer shadow-xl backdrop-blur-xs"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple images) */}
      {images.length > 1 && (
        <div
          className="w-full max-w-md flex items-center justify-center gap-2 pt-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                idx === currentIndex
                  ? "border-[#8C734B] scale-105 opacity-100 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
