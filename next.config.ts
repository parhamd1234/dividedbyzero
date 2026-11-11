import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/forms",
        destination: "https://clinic.parax.workers.dev",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
