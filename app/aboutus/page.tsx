"use client";

import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-4">About ChakulaHub</h1>
      <p className="text-gray-700 mb-4">
        ChakulaHub is your ultimate online food ordering platform, connecting you with your favorite restaurants and meals in just a few clicks. Our mission is to provide a seamless, fast, and reliable way to satisfy your cravings without any hassle.
      </p>

      <h2 className="text-xl font-semibold mt-4">Our Mission</h2>
      <p className="text-gray-700">
        We aim to revolutionize food delivery by ensuring convenience, affordability, and high-quality service for every meal you order. We partner with top restaurants and vendors to bring you a wide variety of options to choose from.
      </p>

      <h2 className="text-xl font-semibold mt-4">Why Choose ChakulaHub?</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li>🛵 Fast and reliable food delivery service</li>
        <li>🍽️ A diverse selection of restaurants and meals</li>
        <li>💳 Secure and hassle-free payment options</li>
        <li>📱 Easy-to-use platform for smooth ordering</li>
        <li>🎯 Excellent customer support to assist you anytime</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">Our Team</h2>
      <p className="text-gray-700">
        ChakulaHub is powered by a passionate team of food lovers, tech enthusiasts, and logistics experts committed to making food delivery as seamless as possible. We strive to improve our services every day to give you the best experience.
      </p>

      <h2 className="text-xl font-semibold mt-4">Contact Us</h2>
      <p className="text-gray-700">
        Have any questions or feedback? {"We'd"} love to hear from you! Reach us at:
      </p>
      <p className="text-gray-700">
        📧 <strong>Email:</strong> support@chakulahub.com <br />
        📞 <strong>Phone:</strong> +254 700 000 000 <br />
        📍 <strong>Location:</strong> Nairobi, Kenya
      </p>
    </div>
  );
};

export default About;
