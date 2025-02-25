"use client";

import React from "react";

const FAQs = () => {
  const faqData = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, browse the menu, select your meal, and proceed to checkout. Payments are completed via M-Pesa or other digital payment options.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Once an order is confirmed, cancellations may not be possible. However, if an issue arises, contact support immediately.",
    },
    {
      question: "What if my payment fails?",
      answer:
        "If your payment fails, check your M-Pesa balance or payment details and try again. If the issue persists, contact support.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach us at support@chakulahub.com or call our support line for urgent assistance.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-orange-1 mb-4">Frequently Asked Questions</h1>
      {faqData.map((faq, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{faq.question}</h2>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
