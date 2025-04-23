
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

- **Frontend**: React / Next.js + Tailwind CSS  
- **State Management**: Zustand  
- **Backend**: Firebase (Firestore + Realtime Database)  
- **Authentication**: Firebase Auth  
- **Payments**: M-Pesa STK Push (via Node.js + Express backend)  
- **Mobile App**: React Native  
- **Hosting**: Vercel / Firebase Hosting  
- **Database**: 
  - Firestore: meal, user, and admin data  
  - Realtime Database: live updates for prescriptions and reminders  
- **PWA**: Service worker & manifest.json integration for installable web app

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/math3wsl3vi/chakula-hub-project-1.git
cd chakula-hub-project-1

Install dependencies:
npm install

Set up your .env file with Firebase, M-Pesa, and other config:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_MPESA_SHORTCODE=your_shortcode
NEXT_PUBLIC_MPESA_CONSUMER_KEY=your_consumer_key
NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your_consumer_secret

Start development server:
npm run dev

📲 Mobile App
ChakulaHub includes a React Native companion app for:
Booking meals


Getting reminders


Managing meal history


🔗 ChakulaHub Mobile App
💸 M-Pesa Integration
Uses Daraja API via a custom Express server


Secure STK push flow for meal payments


Real-time payment status updates in Firestore


🧠 State Management with Zustand
Lightweight global store for:


User session


Booking state


Real-time UI updates


Easy to extend and debug


🧾 PWA Support
Fully installable on Android/iOS via browser


Offline fallback and caching support


Manifest and service worker configured for smooth performance


💡 Use Cases
University and hostel mess booking


Hospital patient dietary tracking


Corporate and staff meal scheduling


📄 License
This project is licensed under the MIT License.

Built with 🦇  by math3wsl3vi to bring smart meals to smart people.



