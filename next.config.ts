import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "qr.adsurkasur.my.id" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/qr-proxy/:path*",
        destination: `${(process.env.NEXT_PUBLIC_QR_API_URL || "https://qr.adsurkasur.my.id").replace(/\/$/, "")}/api/qr/:path*`,
      },
    ];
  },
};

export default config;