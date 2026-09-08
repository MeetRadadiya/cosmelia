import { NextResponse } from "next/server";
import { getCommerceProvider } from "@/lib/commerce";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const commerce = getCommerceProvider();
    const allCategories = await commerce.getCategories();

    // Filter out internal, dropship, or invalid categories
    const validCategories = allCategories
      .filter((c) => {
        if (!c.name || c.name === "null" || c.name === "Category" || c.name.startsWith("Category ")) return false;
        const lower = c.name.toLowerCase();
        if (lower.includes("dropship") || lower.includes("internal")) return false;
        return true;
      })
      .map((c) => {
        // Beautify common singular names if needed
        let formattedName = c.name;
        if (formattedName.toLowerCase() === "eye patche") formattedName = "Collagen Eye Patches";
        if (formattedName.toLowerCase() === "ice roller") formattedName = "Ice Rollers & Cryo";
        if (formattedName.toLowerCase() === "led face mask") formattedName = "LED Face Masks";
        if (formattedName.toLowerCase() === "pimple patches") formattedName = "Acne & Pimple Patches";
        if (formattedName.toLowerCase() === "neck face lifting massager") formattedName = "Neck & Face Lift Massagers";

        return {
          ...c,
          displayName: formattedName,
        };
      });

    return NextResponse.json(
      { categories: validCategories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: any) {
    console.error("[API categories] Error fetching categories:", err);
    return NextResponse.json({ categories: [], error: err.message }, { status: 500 });
  }
}
