import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const res = await fetch("https://getcosmelia.com/?route=journal3/newsletter/newsletter&module_id=341", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${encodeURIComponent(email.trim())}&agree=1`,
    });

    const data = await res.json().catch(() => null);

    if (res.ok && (data?.status === "success" || data?.response?.message === "Success!" || !data)) {
      return NextResponse.json({
        success: true,
        message: "Welcome to the COSMELIA Private Registry. Your subscription has been confirmed.",
      });
    }

    const errorMessage = data?.response?.message || "Unable to subscribe at this time. Please try again.";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
