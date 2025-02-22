import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
