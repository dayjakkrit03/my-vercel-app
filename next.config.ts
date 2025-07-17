// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LIFF_ID: isProd ? '2007752233-1LlOZY09' : '2007752233-1LlOZY09',
  },
  images: {
    domains: ['profile.line-scdn.net'],
  },
};

export default nextConfig;
