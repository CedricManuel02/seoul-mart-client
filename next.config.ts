import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vikwp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/initials",
      },
      {
        protocol: "https",
        hostname: "static-00.iconduck.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "logos-download.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pngimg.com",
        pathname: "**",
      }
      ,
      {
        protocol: "https",
        hostname: "cdn.svgator.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
