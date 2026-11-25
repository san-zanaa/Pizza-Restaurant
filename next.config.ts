import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Menu images come from Unsplash and vendors may enter any image URL,
    // so all remote hosts are allowed through the optimizer.
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
}

export default nextConfig
