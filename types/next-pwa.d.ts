// types/next-pwa.d.ts
declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAOptions {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    swSrc?: string;
  }

  function withPWA(pwaOptions: PWAOptions): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}
