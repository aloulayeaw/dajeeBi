import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["139.99.69.227"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "ytimg.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "**.xx.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;