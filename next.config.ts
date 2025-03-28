import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: "2mb",
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // domains: ["res.cloudinary.com"],
    // loader: "cloudinary",
    // path: "https://res.cloudinary.com/rajeshmurmu/image/upload/",
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // deviceSizes: [640, 1920],
  },
};

export default nextConfig;
