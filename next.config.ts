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
      { source: "/florida", destination: "/florida-utilities", permanent: true },
      { source: "/florida/:path*", destination: "/learn-your-area", permanent: true },
      { source: "/welcome/:path*", destination: "/", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
      { source: "/resources/set-up-utilities", destination: "/resources/utility-setup", permanent: true },
      { source: "/renters/renter-move-in-costs", destination: "/renters/move-in-costs", permanent: true },
      { source: "/renters/utility-responsibilities", destination: "/renters/what-utilities-do-renters-pay", permanent: true },
      { source: "/renters/apartment-internet-setup", destination: "/renters/internet-installation", permanent: true },
      { source: "/resources/find-isp-by-address", destination: "/resources/find-internet-providers", permanent: true },
      { source: "/resources/printables/utility-contact-worksheet", destination: "/resources/printables/new-home-contacts", permanent: true },
      { source: "/resources/printables/outage-preparation-sheet", destination: "/resources/printables/outage-emergency-numbers", permanent: true },
    ];
  },
};

export default nextConfig;
