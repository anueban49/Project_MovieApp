import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    TMDB_BASE_URL: process.env.TMDB_BASE_URL,
    TMDB_IMAGE_SERVICE_URL: process.env.TMDB_IMAGE_SERVICE_URL,
    API_KEY: process.env.API_KEY,
  },
};

export default nextConfig;
