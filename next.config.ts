import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["better-sqlite3"],
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 88] },
  async redirects() {
    return [
      { source: "/timeline/:path*", destination: "/homeowners", permanent: true },
      { source: "/checklists/:path*", destination: "/resources", permanent: true },
      { source: "/florida/:path*", destination: "/learn-your-area", permanent: true },
      { source: "/welcome/:path*", destination: "/", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
    ];
  },
};

export default nextConfig;
