
# 🍽️ ChakulaHub

**ChakulaHub** is a smart meal booking and management platform designed to streamline the process of reserving, organizing, and managing meals in institutions such as universities, hospitals, and organizations.

## 🚀 Features

- 🧑‍🍳 Admin panel for managing food items and meal schedules  
- 📆 Users can view daily meals and book them in advance  
- 💵 **M-Pesa STK Push integration** for seamless payments  
- 🧠 Global state management using **Zustand**  
- 📱 **PWA support** for offline functionality and mobile responsiveness  
- 🔒 Secure authentication and role-based access  
- 🔔 Real-time notifications and meal reminders  
- 📊 Meal booking and payment analytics  

## 🛠️ Tech Stack

- **Frontend**: React / Next.js + Tailwind CSS + Shadcn ui components 
- **State Management**: Zustand  
- **Backend**: Firebase (Firestore + Realtime Database)  
- **Authentication**: Firebase Auth  
- **Payments**: M-Pesa STK Push (via Node.js + Next Api Routes)  
- **Hosting**: Vercel / Firebase Hosting  
- **Database**: 
  - Firestore: meal, user, and admin data  
- **PWA**: Service worker & manifest.json integration for installable web app


## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/math3wsl3v/chakula-hub-project-1.git
2. Navigate to the project directory:

   ```bash
   cd chakula-hub-project-1
   
3. Install dependencies:

    ```bash
    npm install
  
4. Set up environment variables:
Create a .env.local file in the root directory.
Add Firebase and M-Pesa API credentials.

5. Run the development server:
    ```bash
    npm run dev

💸 M-Pesa Integration

- Uses Daraja API via a custom Express server
- Secure STK push flow for meal payments
- Real-time payment status updates in Firestore

🧠 State Management with Zustand

- Lightweight global store for:
  - User session
  - Booking state
  - Real-time UI updates
- Easy to extend and debug

🧾 PWA Support

- Fully installable on Android/iOS via browser
- Offline fallback and caching support
- Manifest and service worker configured for smooth performance

💡 Use Cases

- University and hostel mess booking
- Hospital patient dietary tracking
- Corporate and staff meal scheduling

📄 License

This project is licensed under the MIT License.

Built with 🦇  by math3wsl3vi .
