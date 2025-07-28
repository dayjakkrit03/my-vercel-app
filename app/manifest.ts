// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // ... (ส่วนอื่นๆ ของ manifest)
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
      // แก้ไขตรงนี้: ลบ 'purpose: 'apple touch icon'' ออก
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        // purpose: 'apple touch icon', // ลบบรรทัดนี้ออก
      },
      {
        src: '/icons/maskable_icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}