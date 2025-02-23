import { getMpesaAccessToken } from "@/lib/mpesa";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const accessToken = await getMpesaAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Failed to get M-Pesa access token" }, { status: 500 });
  }

  try {
    const body = await req.json(); // Read JSON body
    const { checkoutRequestID } = body;

    if (!checkoutRequestID) {
      return NextResponse.json({ message: "Missing checkoutRequestID" }, { status: 400 });
    }

    const BusinessShortCode = "174379";
    const PassKey = process.env.MPESA_PASSKEY!;
    const Timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const Password = Buffer.from(`${BusinessShortCode}${PassKey}${Timestamp}`).toString("base64");

    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode,
        Password,
        Timestamp,
        CheckoutRequestID: checkoutRequestID,
      }),
    });

    const data = await response.json();
    console.log("🔍 Mpesa API Response:", data);

    if (!response.ok) {
      return NextResponse.json({ message: "Mpesa API error", details: data }, { status: 500 });
    }

    return NextResponse.json({ status: data.ResultCode === "0" ? "COMPLETED" : "FAILED" });
  } catch (error) {
    console.error("🚨 Server error:", error);
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 });
  }
}
