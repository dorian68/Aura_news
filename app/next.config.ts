import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome : bundle minimal (server.js + node_modules réduit) pour le VPS.
  output: 'standalone',
};

export default nextConfig;
