# 🚀 Delivery App

A simple and efficient food delivery platform built with **Next.js, TypeScript, Firebase, Zustand, and Twilio**. This project was developed as a **1-day coding challenge** to test rapid development skills while ensuring functionality and a great user experience.

---

## 📌 Features

✅ **User Authentication** (Firebase Auth)  
✅ **Browse Food Items** from various restaurants  
✅ **Add to Cart** and manage orders  
✅ **Update Quantity** or Remove Items  
✅ **Order Summary with Total Price Calculation**  
✅ **WhatsApp Order Notifications** via Twilio  
✅ **Responsive Design** for mobile and desktop  

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Firebase** (Auth & Firestore)
- **Zustand** (State Management)
- **Twilio API** (WhatsApp Order Notifications)
- **Tailwind CSS** (Styling)

---

## 🔧 Installation & Setup

1️⃣ Clone the repository:
```bash
git clone https://github.com/yourusername/delivery-app.git
cd delivery-app
```

2️⃣ Install dependencies:
```bash
yarn install  # or npm install
```

3️⃣ Set up environment variables in a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
MY_WHATSAPP_NUMBER=whatsapp:+2547XXXXXXXX
```

4️⃣ Run the development server:
```bash
yarn dev  # or npm run dev
```

---

## 📱 How It Works

1. **User adds food items to the cart**
2. **User enters their phone number & address**
3. **Order is sent via WhatsApp using Twilio API**
4. **Restaurant receives the order and processes it**
5. **Delivery is made! 🚴‍♂️💨**

---

## 📌 Future Improvements

- ✅ Add Payment Gateway (M-Pesa, Stripe)
- ✅ Implement Order Tracking System
- ✅ Enhance UI/UX with better animations
- ✅ Improve backend scalability

---

## 🏆 Challenge Outcome

This app was built as a **1-day challenge** to test efficiency, creativity, and technical skills. The goal was to implement a **functional MVP (Minimum Viable Product)** within **24 hours** while maintaining clean, structured code.

🚀 **Mission Accomplished!** 💪🔥

---

## 📝 License

This project is open-source and available under the **MIT License**.

---

### 💡 Need Help?
Feel free to open an issue or reach out! 😊

Happy Hacking!
