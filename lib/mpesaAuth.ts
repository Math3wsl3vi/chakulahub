import axios from "axios";

export const getMpesaAccessToken = async (): Promise<string> => {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get<{ access_token: string }>(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to obtain M-Pesa access token:", error);
    throw new Error("Failed to obtain M-Pesa access token");
  }
};
