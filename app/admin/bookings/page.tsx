"use client";
import React, { useState, useEffect } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from database
    const fetchBookings = async () => {
      const bookingData = [
        { id: 1, user: "John Doe", meal: "Ugali & Sukuma", date: "Feb 22", paid: true },
      ];
      setBookings(bookingData);
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">User Bookings</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Meal</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Paid</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="border px-4 py-2">{booking.user}</td>
              <td className="border px-4 py-2">{booking.meal}</td>
              <td className="border px-4 py-2">{booking.date}</td>
              <td className="border px-4 py-2">{booking.paid ? "✅ Yes" : "❌ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
