// v.1.1.2 ======================================================
// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Awesome PWA', // เพิ่มหรือแก้ไขชื่อแอปของคุณ
    short_name: 'Awesome PWA', // เพิ่มหรือแก้ไขชื่อย่อ
    description: 'A Next.js PWA with App Router for QR Code Scanning', // เพิ่มคำอธิบาย
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icons/maskable_icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    // *** เพิ่มส่วน screenshots ตรงนี้ ***
    screenshots: [
      // สำหรับ Desktop (form_factor: 'wide')
      {
        src: '/screenshots/desktop-screenshot-1.png', // เปลี่ยนเป็น URL รูปภาพจริงของคุณ
        sizes: '1280x800', // ควรเป็นขนาดที่เหมาะสมสำหรับ Desktop เช่น 1920x1080, 1280x800
        type: 'image/png',
        form_factor: 'wide',
        label: 'App on Desktop', // คำอธิบายสำหรับรูปภาพ
      },
      {
        src: '/screenshots/desktop-screenshot-2.png', // เพิ่มได้อีกถ้ามี
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Another view on Desktop',
      },
      // สำหรับ Mobile (form_factor: 'narrow' หรือไม่ระบุ)
      {
        src: '/screenshots/mobile-screenshot-1.png', // เปลี่ยนเป็น URL รูปภาพจริงของคุณ
        sizes: '720x1280', // ควรเป็นขนาดที่เหมาะสมสำหรับ Mobile เช่น 360x640, 720x1280
        type: 'image/png',
        form_factor: 'narrow', // หรือจะลบบรรทัดนี้ออกก็ได้ เพราะ 'narrow' เป็นค่าเริ่มต้น
        label: 'App on Mobile',
      },
      {
        src: '/screenshots/mobile-screenshot-2.png', // เพิ่มได้อีกถ้ามี
        sizes: '360x640',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view of QR Scanner',
      },
    ],
    // *** สิ้นสุดส่วน screenshots ***
  };
}
// v.1.1.2 ======================================================

// // app/manifest.ts
// import { MetadataRoute } from 'next';

// export default function manifest(): MetadataRoute.Manifest {
//   return {
//     // ... (ส่วนอื่นๆ ของ manifest)
//     icons: [
//       {
//         src: '/icons/icon-192x192.png',
//         sizes: '192x192',
//         type: 'image/png',
//       },
//       {
//         src: '/icons/icon-512x512.png',
//         sizes: '512x512',
//         type: 'image/png',
//       },
//       // แก้ไขตรงนี้: ลบ 'purpose: 'apple touch icon'' ออก
//       {
//         src: '/icons/apple-touch-icon.png',
//         sizes: '180x180',
//         type: 'image/png',
//         // purpose: 'apple touch icon', // ลบบรรทัดนี้ออก
//       },
//       {
//         src: '/icons/maskable_icon.png',
//         sizes: '512x512',
//         type: 'image/png',
//         purpose: 'maskable',
//       },
//     ],
//   };
// }