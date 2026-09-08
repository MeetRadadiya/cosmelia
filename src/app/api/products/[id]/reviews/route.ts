import { NextRequest, NextResponse } from "next/server";
import { getServerReviews, saveReviewToServer } from "@/lib/reviews/serverReviewStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await getServerReviews(id);

    return NextResponse.json({
      success: true,
      productId: id,
      enabled: result.enabled,
      canWrite: result.canWrite,
      requiresLogin: result.requiresLogin,
      summary: result.summary,
      reviews: result.reviews,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { author, rating, title, comment, email, recommend } = body;

    if (!author || typeof author !== "string" || !author.trim()) {
      return NextResponse.json(
        { success: false, error: "Author name is required" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Review comment must be at least 5 characters" },
        { status: 400 }
      );
    }

    const result = await saveReviewToServer(id, {
      author,
      rating: Number(rating) || 5,
      title,
      comment,
      email,
      recommend,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      review: result.review,
      message: result.message,
      pending: result.pending,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process review" },
      { status: 500 }
    );
  }
}
