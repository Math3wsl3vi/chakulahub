import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, amount }: { phone: string; amount: number } = await req.json();

    // Get environment variables
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const callbackUrl = process.env.MPESA_CALLBACK_URL!;

    // Get M-Pesa access token
    const { data: tokenData } = await axios.get<{ access_token: string }>(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    const accessToken = tokenData.access_token;

    // Generate timestamp & password
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // STK Push Request
    const { data: stkResponse } = await axios.post<STKPushResponse>(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: "Test123",
        TransactionDesc: "Payment test",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return NextResponse.json(stkResponse);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("M-Pesa Error:", error.response?.data || error.message);
      return NextResponse.json(
        { message: "M-Pesa API Error", error: error.response?.data || error.message },
        { status: 500 }
      );
    }

    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
