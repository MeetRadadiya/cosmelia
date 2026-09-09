import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/fathershops/services/paymentService";

/**
 * FatherPay Webhook Endpoint
 * 
 * Complies with OpenAPI endpoint:
 * POST /extension/payment/fatherpay_dropship/confirm&webhook=true&json=true
 * 
 * Handles incoming payment notifications dispatched by FatherPay payment gateway.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Forward to FatherShops core payment webhook handler
    const result = await paymentService.confirmPaymentWebhook(payload);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      data: result.data || null,
    });
  } catch (error: any) {
    console.error("[FatherPay Webhook] Error processing webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error processing FatherPay webhook",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    gateway: "FatherPay Dropship Gateway Webhook",
    timestamp: new Date().toISOString(),
  });
}
