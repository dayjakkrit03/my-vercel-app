// lib/useLiff.ts
import { useEffect, useState } from 'react';
import liff from '@line/liff';

// สร้าง Interface สำหรับข้อมูลผู้ใช้ LINE
interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Custom Hook
export const useLiff = () => {
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "2007752233-1LlOZY09"; // ใช้ค่าจาก .env หรือค่า hardcode ชั่วคราว

        if (!liffId) {
          throw new Error("LIFF ID is not defined.");
        }

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setLiffProfile(profile);
        }
      } catch (err) {
        console.error("LIFF initialization failed", err);
        setError("Failed to initialize LIFF or get profile.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []); // useEffect รันแค่ครั้งเดียวเมื่อ Component ที่ใช้ Hook นี้ถูก Mount

  // คืนค่า State และ Error ออกไปเพื่อให้ Component อื่นๆ นำไปใช้ได้
  return { liffProfile, isLoading, error };
};