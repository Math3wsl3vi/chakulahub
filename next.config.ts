import withPWA from "next-pwa"; // ✅ Correct import
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const pwaConfig = withPWA({
  dest: "public",
  disable: !isProd, // Disable PWA in development
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  ...pwaConfig, // ✅ Spread instead of direct assignment
};

export default nextConfig;
