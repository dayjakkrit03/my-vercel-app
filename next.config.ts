// v.1.1.3 ==========================================
// next.config.ts
import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ...
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // ลบ skipWaiting ออกจากตรงนี้

  // ย้าย skipWaiting เข้าไปใน workboxOptions แทน
  workboxOptions: {
    // skipWaiting: true, // สำหรับบางเวอร์ชันอาจจะยังใช้ได้ แต่เวอร์ชันล่าสุดมักจะทำโดยอัตโนมัติ
    // clientsClaim: true, // ควรใช้ clientsClaim คู่กับ skipWaiting
    // สำหรับ @ducanh2912/next-pwa, skipWaiting และ clientsClaim มักจะถูกจัดการภายในอยู่แล้ว
    // คุณไม่จำเป็นต้องกำหนดค่านี้โดยตรง เว้นแต่คุณต้องการปรับแต่งอย่างละเอียด

    // หากคุณต้องการให้ Service Worker ใหม่ทำงานทันที อาจลองใช้ `clientsClaim: true` แทน
    // หรือพิจารณาว่า `register: true` และค่าเริ่มต้นของ next-pwa เพียงพอหรือไม่
    // ใน next-pwa เวอร์ชันล่าสุด (เช่น 9.x.x), skipWaiting และ clientsClaim อาจถูกเปิดใช้งานโดยค่าเริ่มต้นแล้ว
    // หรือมีวิธีการจัดการที่แตกต่างออกไป ให้ตรวจสอบเอกสารของ next-pwa อีกครั้งเพื่อความแน่ใจ

    // ลองลบ skipWaiting ออกไปเลย และดูว่า PWA ยังทำงานได้ดีอยู่หรือไม่
    // หากต้องการควบคุม ให้ดูที่ options อื่นๆ ใน workboxOptions ของ @ducanh2912/next-pwa
  }
});

export default withPWAConfig(nextConfig);
// v.1.1.3 ==========================================

// v.1.1.2 ===========================================
// next.config.ts
// import type { NextConfig } from 'next';
// import withPWA = require('next-pwa'); // ใช้ require-style import แบบ TypeScript

// const isDev = process.env.NODE_ENV === 'development';

// const nextConfig: NextConfig = withPWA({
//   dest: 'public',
//   disable: isDev,
//   register: true,
//   skipWaiting: true,
// })({
//   reactStrictMode: true,
// });

// export default nextConfig;
// v.1.1.2 ===========================================

// next.config.ts
// import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === 'production';

// const nextConfig: NextConfig = {
//   env: {
//     NEXT_PUBLIC_LIFF_ID: isProd ? '2007752233-1LlOZY09' : '2007752233-1LlOZY09',
//   },
//   images: {
//     domains: ['profile.line-scdn.net'],
//   },
// };

// export default nextConfig;
