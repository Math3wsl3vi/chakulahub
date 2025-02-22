import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json();

    console.log("M-Pesa Callback Received:", JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      return NextResponse.json({ message: "Invalid callback format" }, { status: 400 });
    }

    const stkCallback = Body.stkCallback;
    const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Log request IDs for debugging
    console.log("MerchantRequestID:", stkCallback.MerchantRequestID);
    console.log("CheckoutRequestID:", stkCallback.CheckoutRequestID);

    if (ResultCode === 0) {
      console.log("✅ Payment successful:", CallbackMetadata);
    } else {
      console.error("❌ Payment failed:", ResultDesc);
    }

    return NextResponse.json({ message: "Callback received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing callback:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
