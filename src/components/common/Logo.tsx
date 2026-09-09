import React from "react";
import Link from "next/link";

export interface LogoProps {
  variant?: "light" | "dark" | "monogram";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
}

/**
 * COSMELIA - High-Contrast Luxury Brand Logo.
 * 100% Original Vector Artwork.
 * Bold, razor-sharp visibility on pure white and light backgrounds.
 * Features:
 * - Bold architectural 'C' arc in deep obsidian (#141416)
 * - Sculptural faceted gold phototherapy radiance star (#D4AF37 / #C5A059)
 * - Pure brand wordmark "COSMELIA" (zero subtitles, zero tagline)
 */
export const Logo: React.FC<LogoProps> = ({
  variant = "light",
  size = "md",
  className = "",
  asLink = false,
  href = "/",
  onClick,
}) => {
  const dimensions = {
    sm: {
      emblemSize: 28,
      textSize: "text-lg md:text-xl tracking-[0.16em]",
      gap: "gap-2.5",
    },
    md: {
      emblemSize: 36,
      textSize: "text-xl md:text-2xl tracking-[0.18em]",
      gap: "gap-3",
    },
    lg: {
      emblemSize: 48,
      textSize: "text-2xl md:text-3xl tracking-[0.2em]",
      gap: "gap-3.5",
    },
    xl: {
      emblemSize: 64,
      textSize: "text-3xl md:text-4xl tracking-[0.22em]",
      gap: "gap-4",
    },
  }[size];

  const isDarkBg = variant === "dark";
  const cColor = isDarkBg ? "#FAF9F6" : "#141416";
  const textColor = isDarkBg ? "text-[#FAF9F6]" : "text-[#141416]";

  const content = (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${dimensions.gap} select-none group/logo ${className}`}
    >
      {/* High-Contrast Vector Emblem */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover/logo:scale-105">
        <svg
          width={dimensions.emblemSize}
          height={dimensions.emblemSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="COSMELIA Logo Mark"
        >
          {/* Concentric Architectural 'C' Ring with Maximum Contrast */}
          <path
            d="M 83.7 21.7 A 44 44 0 1 0 83.7 78.3 L 73 69.3 A 30 30 0 1 1 73 30.7 Z"
            fill={cColor}
          />

          {/* Faceted 8-Point Golden Radiance Star (Focal Center at 50, 50) */}
          {/* North Ray */}
          <polygon points="50,6 55,44 50,49 45,44" fill="#C5A059" />
          <polygon points="50,6 50,49 45,44" fill="#F3E5AB" />

          {/* South Ray */}
          <polygon points="50,94 55,56 50,51 45,56" fill="#9E7D2E" />
          <polygon points="50,94 50,51 45,56" fill="#D4AF37" />

          {/* East Ray */}
          <polygon points="94,50 56,55 51,50 56,45" fill="#B8943C" />
          <polygon points="94,50 51,50 56,45" fill="#F3E5AB" />

          {/* West Ray */}
          <polygon points="6,50 44,55 49,50 44,45" fill="#8C6E2A" />
          <polygon points="6,50 49,50 44,45" fill="#D4AF37" />

          {/* Diagonal North-East Ray */}
          <polygon points="78,22 54,46 50,50 50,44" fill="#D4AF37" />
          <polygon points="78,22 50,50 55,46" fill="#FBF3D5" />

          {/* Diagonal South-East Ray */}
          <polygon points="78,78 54,54 50,50 55,50" fill="#9E7D2E" />
          <polygon points="78,78 50,50 50,56" fill="#C5A059" />

          {/* Diagonal South-West Ray */}
          <polygon points="22,78 46,54 50,50 45,50" fill="#8C6E2A" />
          <polygon points="22,78 50,50 50,56" fill="#B8943C" />

          {/* Diagonal North-West Ray */}
          <polygon points="22,22 46,46 50,50 50,44" fill="#C5A059" />
          <polygon points="22,22 50,50 45,46" fill="#F3E5AB" />

          {/* Central Radiant Diamond Highlight */}
          <polygon points="50,40 60,50 50,60 40,50" fill="#FFFDF5" stroke="#D4AF37" strokeWidth="1.2" />
          <polygon points="50,44 56,50 50,56 44,50" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Pure Brand Name Wordmark: Only COSMELIA */}
      {variant !== "monogram" && (
        <span
          className={`font-serif font-bold uppercase ${dimensions.textSize} ${textColor} transition-colors group-hover/logo:text-[#C5A059] leading-none tracking-[0.18em]`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          COSMELIA
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex items-center focus:outline-none" aria-label="COSMELIA Home">
        {content}
      </Link>
    );
  }

  return content;
};
