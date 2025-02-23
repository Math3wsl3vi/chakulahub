"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t shadow-sm rounded-t-md bg-white p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
        
        {/* Brand Section */}
        <div>
          <h1 className="font-bold text-xl text-orange-500">CHAKULAHUB</h1>
          <p className="text-sm">Contact us</p>
          <p className="text-sm">Email: <Link href="mailto:chakulahub@gmail.com" className="text-blue-500">chakulahub@gmail.com</Link></p>
          <p className="text-sm">Call: <a href="tel:+254798 050462" className="text-orange-500 font-semibold">0798 050462</a></p>
        </div>

        {/* Navigation Links */}
        <div>
          <h1 className="text-xl font-semibold">Links</h1>
          <ul className="mt-2 space-y-1">
            <li><Link href="/faqs" className="text-sm hover:text-orange-500">FAQs</Link></li>
            <li><Link href="/aboutus" className="text-sm hover:text-orange-500">About Us</Link></li>
            <li><Link href="/terms" className="text-sm hover:text-orange-500">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div>
          <h1 className="text-xl font-semibold">Follow Us</h1>
          <div className="flex gap-4 mt-3">
            <Link href="https://x.com/chakulaHubKenya" target="_blank" className="hover:opacity-75">
              <Image src="/images/twitter.png" alt="Twitter" width={20} height={20} />
            </Link>
            <Link href="https://web.facebook.com/profile.php?id=61573381958394" target="_blank" className="hover:opacity-75">
              <Image src="/images/facebook.png" alt="Facebook" width={20} height={20} />
            </Link>
            <Link href="https://www.instagram.com/chakulahubkenya/" target="_blank" className="hover:opacity-75">
              <Image src="/images/insta.png" alt="Instagram" width={20} height={20} />
            </Link>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-600 mt-6 border-t pt-4">
        &copy; {new Date().getFullYear()} ChakulaHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
