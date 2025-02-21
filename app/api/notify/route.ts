import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, items, total, phone, address } = await req.json() as {
      orderId: string;
      items: OrderItem[];
      total: number;
      phone: string;
      address: string;
    };

    const client = Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER!,
      body: `📦 New Order Received!\n\n🛒 Order From: ${phone}\n📍 Delivery Location: ${address}\n🔖 Order ID: ${orderId}\n📝 Items:\n${items
        .map((item) => `- ${item.name} x${item.quantity} (Ksh ${item.price})`)
        .join("\n")}\n\n💰 Total: Ksh ${total}\n🚀 Ready for processing!`,
    });

    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Unknown error occurred" });
  }
}
