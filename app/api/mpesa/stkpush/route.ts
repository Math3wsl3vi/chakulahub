import { NextResponse } from "next/server";
import axios from "axios";
import moment from "moment";

const getMpesaAccessToken = async (): Promise<string> => {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get<{ access_token: string }>(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${credentials}` } }
    );

    return response.data.access_token;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("M-Pesa Auth Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("M-Pesa Auth Error:", error.message);
    } else {
      console.error("M-Pesa Auth Error: An unknown error occurred.");
    }
    throw new Error("Failed to obtain access token");
  }
};

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();
    const accessToken = await getMpesaAccessToken();

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await axios.post<{
      MerchantRequestID: string;
      CheckoutRequestID: string;
    }>(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://yourdomain.com/api/mpesa/callback",
        AccountReference: "Order123",
        TransactionDesc: "Payment for order",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      message: "STK push sent. Please approve on your phone.",
      MerchantRequestID: response.data.MerchantRequestID,
      CheckoutRequestID: response.data.CheckoutRequestID,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("STK Push Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("STK Push Error:", error.message);
    } else {
      console.error("STK Push Error: An unknown error occurred.");
    }

    return NextResponse.json({ message: "STK push failed" }, { status: 500 });
  }
}
