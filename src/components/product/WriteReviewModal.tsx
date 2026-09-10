"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductReview } from "@/lib/commerce/types";
import { addProductReview } from "@/lib/reviews/reviewStore";

interface WriteReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (review: ProductReview) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Poor",
  2: "2 - Below Expectations",
  3: "3 - Average",
  4: "4 - Very Good",
  5: "5 - Excellent",
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
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
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setName("");
      setEmail("");
      setTitle("");
      setComment("");
      setRecommend(true);
      setImages([]);
      setIsSuccess(false);
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        const src = e.target?.result as string;
        if (!src) return resolve("");
        img.src = src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX) {
              height *= MAX / width;
              width = MAX;
            }
          } else {
            if (height > MAX) {
              width *= MAX / height;
              height = MAX;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = () => resolve(src);
      };
      reader.onerror = () => resolve("");
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) continue;
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        setImages((prev) => [...prev, compressedDataUrl].slice(0, 4));
      }
    }

    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage("Please write a review of at least 5 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewPayload = {
        author: name.trim(),
        rating,
        title:
          title.trim() ||
          (rating >= 4 ? "Highly recommended" : "Product feedback"),
        comment: comment.trim(),
        recommend,
        email: email.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      };

      let serverReview: ProductReview | null = null;
      let msg = "Thank you for your review. It has been submitted for display.";

      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(product.id)}/reviews`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewPayload),
          },
        );
        const data = await res.json();
        if (data && data.success) {
          if (data.review) serverReview = data.review;
          if (data.message) msg = data.message;
        } else if (data && data.error) {
          throw new Error(data.error);
        }
      } catch (apiErr: any) {
        if (apiErr?.message) {
          throw apiErr;
        }
      }

      const { review: localReview } = addProductReview(product, reviewPayload);
      const finalReview = serverReview || { ...localReview, images };

      setIsSubmitting(false);
      setSuccessMessage(msg);
      setIsSuccess(true);
      onReviewSubmitted(finalReview);

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        err?.message || "Failed to submit review. Please try again.",
      );
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
    >
      <div className="relative w-full max-w-xl bg-white border border-[#EAE8E1] rounded-sm shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE8E1] px-6 py-4 bg-[#FAF9F6] shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
              Verified Client Review
            </span>
            <h2
              id="write-review-title"
              className="text-lg sm:text-xl font-serif text-[#141416]"
            >
              Write a Review
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-[#5E6472] hover:text-[#141416] transition-colors rounded-sm hover:bg-[#EAE8E1]/50 cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Product Snippet */}
        <div className="px-6 py-3 bg-[#FAF9F6]/50 border-b border-[#EAE8E1] flex items-center gap-3 shrink-0">
          {product.images && product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-sm border border-[#EAE8E1]"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#141416] truncate">
              {product.name}
            </p>
            <p className="text-[11px] text-[#5E6472]">{product.category}</p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-[#2D5A43]/10 text-[#2D5A43] rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-[#141416]">
                  Thank You For Your Review!
                </h3>
                <p className="text-xs text-[#5E6472] max-w-sm mx-auto">
                  {successMessage || "Thank you for your feedback."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                  {errorMessage}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#141416] flex items-center justify-between">
                  <span>Overall Rating *</span>
                  <span className="text-[11px] font-normal text-[#8C734B]">
                    {RATING_LABELS[activeRating]}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-[#A17840] hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        <svg
                          className="w-7 h-7"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill={star <= activeRating ? "currentColor" : "none"}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[#5E6472] font-medium ml-1">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Author Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="review-author"
                    className="text-xs uppercase tracking-wider font-semibold text-[#141416]/90 block"
                  >
                    Your Name *
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="review-email"
                    className="text-xs uppercase tracking-wider font-semibold text-[#141416]/90 block"
                  >
                    Email Address{" "}
                    <span className="text-[10px] text-[#8C734B] font-normal">
                      (for verification)
                    </span>
                  </label>
                  <input
                    id="review-email"
                    type="email"
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors"
                  />
                </div>
              </div>

              {/* Review Headline / Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="review-title"
                  className="text-xs uppercase tracking-wider font-semibold text-[#141416]/90 block"
                >
                  Review Headline
                </label>
                <input
                  id="review-title"
                  type="text"
                  placeholder="e.g. Visible skin clarity within two weeks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors"
                />
              </div>

              {/* Review Comment / Experience */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="review-comment"
                    className="text-xs uppercase tracking-wider font-semibold text-[#141416]/90"
                  >
                    Your Review & Feedback *
                  </label>
                  <span className="text-[10px] text-[#8B92A2]">
                    {comment.length} characters (min 5)
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  required
                  rows={3}
                  placeholder="Share details about how you use this item, overall skin feel, and results..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#EAE8E1] rounded-sm text-[#141416] placeholder:text-[#8B92A2] focus:outline-none focus:border-[#141416] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2 pt-1 border-t border-[#EAE8E1]">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#141416]/90 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-[#8C734B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Attach Product Photos</span>
                  </label>
                  <span className="text-[10px] text-[#8B92A2]">
                    {images.length} / 4 photos
                  </span>
                </div>

                {/* Thumbnail Previews & Upload Button */}
                <div className="flex flex-wrap items-center gap-3">
                  {images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-sm border border-[#EAE8E1] overflow-hidden group"
                    >
                      <img
                        src={imgSrc}
                        alt={`Review upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 p-1 bg-black/75 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <label className="w-16 h-16 rounded-sm border border-dashed border-[#8C734B]/60 hover:border-[#141416] bg-[#FAF9F6] hover:bg-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                      <svg
                        className="w-5 h-5 text-[#8C734B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8C734B]">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Recommendation Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="review-recommend"
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="w-4 h-4 text-[#8C734B] border-[#EAE8E1] rounded focus:ring-[#8C734B] cursor-pointer"
                />
                <label
                  htmlFor="review-recommend"
                  className="text-xs text-[#141416] cursor-pointer select-none"
                >
                  I recommend this product for everyday self-care routines
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE8E1]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#5E6472] hover:text-[#141416] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold bg-[#141416] text-[#FAF9F6] rounded-sm hover:bg-[#2b2d33] transition-all cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
