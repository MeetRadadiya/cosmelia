"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ImageLightboxModal } from "./ImageLightboxModal";

interface ProductDescriptionProps {
  description?: string;
}

/**
 * Cleans and normalizes raw WYSIWYG HTML description coming from backend/OpenCart/AliExpress editors.
 * Strips disruptive inline font families, font sizes, line heights, fixed colors, and rigid dimensions,
 * and prepares consecutive images for responsive grid display.
 */
export function cleanProductDescription(html?: string): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Replace &nbsp; with space
  cleaned = cleaned.replace(/&nbsp;/gi, " ");

  // 2. Remove intrusive typography/color/sizing inline styles while keeping basic layout if any
  cleaned = cleaned.replace(
    /style=(["'])(.*?)\1/gi,
    (_match, _quote, styleStr) => {
      const filtered = styleStr
        .split(";")
        .map((s: string) => s.trim())
        .filter((rule: string) => {
          if (!rule) return false;
          const prop = rule.split(":")[0]?.toLowerCase().trim();
          if (!prop) return false;
          return ![
            "font-family",
            "font-size",
            "line-height",
            "color",
            "background-color",
            "background",
            "width",
            "height",
            "max-width",
            "min-width",
            "margin",
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right",
            "padding",
            "padding-top",
            "padding-bottom",
            "padding-left",
            "padding-right",
          ].includes(prop);
        })
        .join("; ");

      return filtered ? `style="${filtered}"` : "";
    }
  );

  // 3. Remove fixed width and height attributes (e.g. width="800" height="600")
  cleaned = cleaned.replace(/\s+(width|height)=(["'])\d+%?\2/gi, "");

  // 4. Remove deprecated <font> tags: <font color="...">text</font> -> text
  cleaned = cleaned.replace(/<\/?font[^>]*>/gi, "");

  // 5. Clean up empty paragraphs & standalone <br> sequences
  cleaned = cleaned.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "");

  // 6. Strip <br> tags directly following <img> tags (common in OpenCart editor output)
  cleaned = cleaned.replace(/(<img\b[^>]*>)\s*(?:<br\s*\/?>\s*)+/gi, "$1");

  // 7. Ensure image tags have loading="lazy"
  cleaned = cleaned.replace(/<img\s+(?![^>]*\bloading=)/gi, '<img loading="lazy" ');

  // 8. Convert detailmodule_image divs into description-image-grid
  cleaned = cleaned.replace(
    /<div[^>]*class=["'](?=[^"']*detailmodule_image)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    '<div class="description-image-grid">$1</div>'
  );

  // 9. Group sequences of 2 or more consecutive image blocks into a grid
  const blockPattern = /((?:(?:<(?:p|div)[^>]*>\s*)?<img\b[^>]*>(?:\s*<\/(?:p|div)>)?\s*){2,})/gi;

  cleaned = cleaned.replace(blockPattern, (match) => {
    const imgMatches = match.match(/<img\b[^>]*>/gi);
    if (!imgMatches || imgMatches.length < 2) return match;
    return `<div class="description-image-grid">${imgMatches.join("")}</div>`;
  });

  return cleaned.trim();
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isHtml = useMemo(() => {
    return Boolean(description && /<[a-z][\s\S]*>/i.test(description));
  }, [description]);

  const sanitizedHtml = useMemo(() => {
    if (!description || !isHtml) return "";
    return cleanProductDescription(description);
  }, [description, isHtml]);

  // Client-side DOM pass: Ensures EVERY single product's ungridded description images get grouped into .description-image-grid
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const allImgs = Array.from(container.querySelectorAll("img"));
    if (allImgs.length < 2) return;

    let ungriddedGroup: HTMLImageElement[] = [];

    const flushUngriddedGroup = () => {
      if (ungriddedGroup.length >= 2) {
        const gridDiv = document.createElement("div");
        gridDiv.className = "description-image-grid";

        const firstImg = ungriddedGroup[0];
        const parentNode = firstImg.parentNode;
        if (parentNode) {
          parentNode.insertBefore(gridDiv, firstImg);

          ungriddedGroup.forEach((img) => {
            // Remove parent <p> or <div> if it only contained this image
            const pParent = img.parentElement;
            gridDiv.appendChild(img);
            if (pParent && pParent !== container && pParent.childNodes.length === 0) {
              pParent.remove();
            }
          });
        }
      }
      ungriddedGroup = [];
    };

    allImgs.forEach((img) => {
      const isInsideGrid = img.closest(".description-image-grid, .detailmodule_image");
      if (!isInsideGrid) {
        ungriddedGroup.push(img);
      } else {
        flushUngriddedGroup();
      }
    });

    flushUngriddedGroup();
  }, [sanitizedHtml]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === "IMG") {
      const src = target.getAttribute("src");
      if (src) {
        const container = e.currentTarget;
        const imgElements = Array.from(container.querySelectorAll("img"));
        const sources = imgElements.map((img) => img.getAttribute("src")).filter(Boolean) as string[];
        const idx = sources.indexOf(src);
        setLightboxImages(sources.length > 0 ? sources : [src]);
        setLightboxIndex(idx >= 0 ? idx : 0);
        setLightboxOpen(true);
      }
    }
  };

  if (!description || !description.trim()) {
    return (
      <p className="text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed italic">
        No product description available.
      </p>
    );
  }

  if (isHtml) {
    return (
      <>
        <div
          ref={containerRef}
          className="wysiwyg-content"
          onClick={handleContainerClick}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        <ImageLightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxImages}
          initialIndex={lightboxIndex}
        />
      </>
    );
  }

  return (
    <div className="wysiwyg-content">
      <p className="whitespace-pre-line">{description}</p>
    </div>
  );
};
