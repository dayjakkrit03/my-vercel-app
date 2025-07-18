
// v.1.1.2 ===============================================================
// lib/useLiff.ts
import { useEffect, useState, useCallback } from 'react'; // import useCallback เพิ่มเติม
import liff from '@line/liff';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export const useLiff = () => {
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // ทำให้ initializeLiff เป็น useCallback เพื่อไม่ให้สร้างใหม่ทุกครั้งที่ re-render
  const initializeLiff = useCallback(async () => {
    setIsLoading(true); // ตั้งค่า isLoading เป็น true เสมอเมื่อจะ initialize ใหม่
    setError(null); // ล้าง error เก่า
    try {
      const liffId = "2007752233-1LlOzY09";

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
      setLiffProfile(null); // ตั้งค่าโปรไฟล์เป็น null หากเกิดข้อผิดพลาด
    } finally {
      setIsLoading(false);
    }
  }, []); // ไม่มี dependencies เพราะไม่มีค่าภายนอกที่ต้องอ้างอิง

  useEffect(() => {
    initializeLiff();
  }, [initializeLiff]); // เรียกใช้ initializeLiff เมื่อ Hook ถูก Mount หรือเมื่อ initializeLiff เปลี่ยน

  // ฟังก์ชันสำหรับสแกน QR Code (โค้ดเดิม)
  const handleScan = async () => {
    try {
      setIsScanning(true);
      if (!liff.scanCode) {
        throw new Error("LIFF scanCode is not available. Please ensure your LIFF app has 'QR code reader' scope enabled.");
      }
      const result = await liff.scanCode();
      if (result.value) {
          setScanResult(result.value);
      } else {
          setScanResult("No QR code found or scan cancelled.");
      }
    } catch (err) {
      console.error('Scan failed', err);
      setScanResult(`Scan failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsScanning(false);
    }
  };

  // ฟังก์ชัน Logout ที่เราจะส่งออกไปใช้
  const handleLogout = async () => {
    try {
      if (liff.isLoggedIn()) {
        await liff.logout();
      }
      // หลังจาก logout สำเร็จ ให้ reinitialize LIFF ใหม่
      // เพื่อให้มันตรวจสอบสถานะการ login และนำไปสู่หน้า login ถ้าจำเป็น
      setLiffProfile(null); // ล้างข้อมูลโปรไฟล์ทันที
      await initializeLiff(); // เรียก initializeLiff ใหม่
    } catch (err) {
      console.error("LIFF logout failed", err);
      setError("Failed to logout.");
    }
  };

  return { liffProfile, isLoading, error, scanResult, handleScan, isScanning, handleLogout }; // ส่ง handleLogout ออกไปด้วย
};
// v.1.1.2 ===============================================================

// // lib/useLiff.ts
// import { useEffect, useState } from 'react';
// import liff from '@line/liff';

// // สร้าง Interface สำหรับข้อมูลผู้ใช้ LINE
// interface LiffProfile {
//   userId: string;
//   displayName: string;
//   pictureUrl?: string;
//   statusMessage?: string;
// }

// // Custom Hook
// export const useLiff = () => {
//   const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const [isScanning, setIsScanning] = useState(false);

//   useEffect(() => {
//     const initializeLiff = async () => {
//       try {
//         const liffId = "2007752233-1LlOzY09"; // ใช้ค่าจาก .env หรือค่า hardcode ชั่วคราว

//         if (!liffId) {
//           throw new Error("LIFF ID is not defined.");
//         }

//         await liff.init({ liffId });

//         // if (!liff.isInClient()) {
//         //   setError("โปรดเปิดแอปนี้ผ่าน LINE เท่านั้น");
//         //   return;
//         // }

//         if (!liff.isLoggedIn()) {
//           liff.login();
//         } else {
//           const profile = await liff.getProfile();
//           setLiffProfile(profile);
//         }

//       } catch (err) {
//         console.error("LIFF initialization failed", err);
//         setError("Failed to initialize LIFF or get profile.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeLiff();
//   }, []); // useEffect รันแค่ครั้งเดียวเมื่อ Component ที่ใช้ Hook นี้ถูก Mount

//   // ฟังก์ชันสำหรับสแกน QR Code
//   const handleScan = async () => {
//     try {
//       setIsScanning(true);
//       // ตรวจสอบว่า LIFF รองรับการสแกน QR Code หรือไม่
//       if (!liff.scanCode) {
//         throw new Error("LIFF scanCode is not available. Please ensure your LIFF app has 'QR code reader' scope enabled.");
//       }
//       const result = await liff.scanCode();
//       if (result.value) {
//           setScanResult(result.value);
//       } else {
//           // กรณีที่ผู้ใช้กดยกเลิกการสแกน หรือไม่พบค่า
//           setScanResult("No QR code found or scan cancelled.");
//       }
//     } catch (err) {
//       console.error('Scan failed', err);
//       setScanResult(`Scan failed: ${err instanceof Error ? err.message : String(err)}`);
//     } finally {
//       setIsScanning(false);
//     }
//   };

//   // คืนค่า State และฟังก์ชันที่จำเป็นออกไป
//   return { liffProfile, isLoading, error, scanResult, handleScan, isScanning };
// };
