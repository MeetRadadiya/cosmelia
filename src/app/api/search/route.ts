import { NextRequest, NextResponse } from "next/server";
import { getCommerceProvider } from "@/lib/commerce";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const commerce = getCommerceProvider();
  const products = await commerce.searchProducts(query);

  return NextResponse.json({ products });
}
