import { db } from "@/configs/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "mt1",
  useTLS: true,
});

type CallbackItem = { Name: string; Value: string | number };
type PaymentMetadata = { [key: string]: string | number };

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

    if (ResultCode === 0) {
      // Extract transaction details
      const metadata = CallbackMetadata.Item.reduce((acc: PaymentMetadata, item: CallbackItem) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {} as PaymentMetadata);

      const paymentDetails = {
        receiptNumber: metadata["MpesaReceiptNumber"] || "",
        phoneNumber: metadata["PhoneNumber"] || "",
        amount: metadata["Amount"] || 0,
      };

      console.log("✅ Payment successful:", paymentDetails);

      // Save payment confirmation in Firestore (Firebase v9+ syntax)
      const paymentRef = doc(collection(db, "payments"), paymentDetails.receiptNumber);
      await setDoc(paymentRef, {
        status: "PAID",
        phoneNumber: paymentDetails.phoneNumber,
        amount: paymentDetails.amount,
        timestamp: new Date(),
      });

      // Notify frontend about payment confirmation
      await pusher.trigger("mpesa-channel", "payment-success", {
        message: "Payment received",
        metadata: paymentDetails,
      });

      return NextResponse.json({ message: "Payment confirmed" }, { status: 200 });
    } else {
      console.error("❌ Payment failed:", ResultDesc);
      return NextResponse.json({ message: "Payment failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing callback:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
