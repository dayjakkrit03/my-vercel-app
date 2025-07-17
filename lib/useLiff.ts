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
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffId = "2007752233-1LlOzY09"; // ใช้ค่าจาก .env หรือค่า hardcode ชั่วคราว

        if (!liffId) {
          throw new Error("LIFF ID is not defined.");
        }

        await liff.init({ liffId });

        // if (!liff.isInClient()) {
        //   setError("โปรดเปิดแอปนี้ผ่าน LINE เท่านั้น");
        //   return;
        // }

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

  // ฟังก์ชันสำหรับสแกน QR Code
  const handleScan = async () => {
    try {
      setIsScanning(true);
      // ตรวจสอบว่า LIFF รองรับการสแกน QR Code หรือไม่
      if (!liff.scanCode) {
        throw new Error("LIFF scanCode is not available. Please ensure your LIFF app has 'QR code reader' scope enabled.");
      }
      const result = await liff.scanCode();
      if (result.value) {
          setScanResult(result.value);
      } else {
          // กรณีที่ผู้ใช้กดยกเลิกการสแกน หรือไม่พบค่า
          setScanResult("No QR code found or scan cancelled.");
      }
    } catch (err) {
      console.error('Scan failed', err);
      setScanResult(`Scan failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsScanning(false);
    }
  };

  // คืนค่า State และฟังก์ชันที่จำเป็นออกไป
  return { liffProfile, isLoading, error, scanResult, handleScan, isScanning };
};
