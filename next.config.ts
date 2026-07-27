import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      { source: "/florida/getting-started", destination: "/florida/moving-to-florida-checklist", permanent: true },
      { source: "/florida/homeowners", destination: "/florida/new-florida-homeowner-guide", permanent: true },
      { source: "/florida/renters", destination: "/renters/renter-move-in-checklist", permanent: true },
      { source: "/florida/hurricane-prep", destination: "/florida/hurricane-preparation", permanent: true },
    ];
  },
};

export default nextConfig;
