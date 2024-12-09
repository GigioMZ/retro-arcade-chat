import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone", // Ensures the build is optimized for deployment
  trailingSlash: true,  // Ensures consistent URL paths with trailing slashes
};

export default nextConfig;
