export async function getMpesaAccessToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const auth = "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  
    try {
      const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: "GET",
        headers: { Authorization: auth },
      });
  
      if (!response.ok) {
        throw new Error(`M-Pesa Token Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error fetching M-Pesa token:", error);
      return null;
    }
  }