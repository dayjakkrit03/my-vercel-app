// v.1.1.4 ======================================================================
// app/page.tsx
"use client"; // แจ้งให้ Next.js รู้ว่านี่คือ Client Component

import { useEffect, useState, useRef, useCallback } from "react"; // <-- เพิ่ม useCallback
// import Image from 'next/image'; // <-- ลบออก หรือถ้าจะใช้ Image จริงๆ ให้เปลี่ยนแท็กด้านล่างด้วย
import { useLiff } from "./contexts/LiffContext"; // นำเข้า useLiff hook

// Type Guard สำหรับตรวจสอบ Error object ที่มี 'code' property
interface LiffErrorWithCode extends Error {
  code?: number;
}
function isLiffErrorWithCode(error: unknown): error is LiffErrorWithCode {
  return error instanceof Error && typeof (error as LiffErrorWithCode).code === 'number';
}


export default function HomePage() {
  const { liff, liffError, isLiffInitialized } = useLiff();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ห่อหุ้ม stopCamera ด้วย useCallback
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCapturedImage(null); // Clear captured image when stopping camera
    }
  }, [cameraStream]); // Dependency array ของ useCallback คือสิ่งที่ stopCamera ใช้นอกเหนือจากตัวเอง

  // --- Function for liff.scanCode() ---
  const handleScanCode = async () => {
    if (!isLiffInitialized) {
      alert("LIFF is still initializing. Please wait.");
      return;
    }
    if (!liff) {
      console.error("LIFF object is not available.");
      alert("LIFF object is not available. Please ensure LIFF is initialized correctly and no errors occurred.");
      return;
    }

    // ตรวจสอบว่า liff.scanCode() มีอยู่จริงและเป็นฟังก์ชัน
    if (typeof liff.scanCode !== 'function') {
      alert("liff.scanCode() is not available. This usually means you are not in the LINE app or your LIFF version is too old.");
      return;
    }

    // ตรวจสอบว่าเป็น LINE Browser หรือไม่
    if (!liff.isInClient()) {
      alert("This feature (liff.scanCode) is only available inside the LINE app. Please open this page in LINE's in-app browser.");
      return;
    }

    try {
      const result = await liff.scanCode();
      if (result && result.value) {
        setScanResult(result.value);
        alert(`Scan Result: ${result.value}`);
      } else {
        setScanResult("No QR code scanned or scan cancelled.");
        alert("No QR code scanned or scan cancelled.");
      }
    } catch (error: unknown) {
      console.error("Error scanning code:", error);
      if (error instanceof Error) {
        alert(`Error scanning code: ${error.message}`);
        // ใช้ Type Guard ที่สร้างขึ้นมาเพื่อตรวจสอบ 'code' property
        if (isLiffErrorWithCode(error) && error.code === 2) {
            alert("Camera permission denied. Please grant camera access to LINE app.");
        }
      } else {
        alert("An unknown error occurred while scanning code.");
      }
    }
  };

  // --- Functions for navigator.mediaDevices.getUserMedia() ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error: unknown) { // แก้ไข: ใช้ unknown แทน any
      console.error("Error accessing camera:", error);
      if (error instanceof Error) {
        alert(`Error accessing camera: ${error.message}\nMake sure you grant camera permissions.`);
      } else {
        alert("An unknown error occurred while accessing camera.");
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas: HTMLCanvasElement = canvasRef.current; // ระบุ Type อย่างชัดเจน
      const context = canvas.getContext("2d"); // ตอนนี้ context จะรู้ Type ที่ถูกต้องแล้ว

      if (context) {
        // Ensure video is playing and has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            alert("Video stream is not ready. Please wait.");
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      stopCamera();
    };
  }, [stopCamera]); // <-- ถูกต้องแล้ว เพราะ stopCamera ห่อด้วย useCallback

  return (
    <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>LIFF Camera Example (Next.js App Router & TypeScript)</h1>

      {!isLiffInitialized && <p>Loading LIFF...</p>}
      {isLiffInitialized && liffError && (
        <p style={{ color: "red" }}>
          LIFF initialization failed: <code>{liffError}</code>
        </p>
      )}

      {isLiffInitialized && !liffError && (
        <div style={{ marginBottom: '30px' }}>
          <h2>1. Scan QR Code (using `liff.scanCode()`)</h2>
          <p>This only works inside the LINE app (LIFF v2.9.0+).</p>
          <button onClick={handleScanCode} style={buttonStyle}>
            Scan QR Code
          </button>
          {scanResult && <p><strong>Scan Result:</strong> {scanResult}</p>}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>2. Access Camera Directly (using `navigator.mediaDevices.getUserMedia()`)</h2>
        <p>This works in any modern browser, including LIFF Browser.</p>
        {!cameraStream ? (
          <button onClick={startCamera} style={buttonStyle}>
            Start Camera
          </button>
        ) : (
          <div>
            <video ref={videoRef} style={videoStyle} autoPlay playsInline muted></video>
            <div style={{ marginTop: '10px' }}>
              <button onClick={captureImage} style={buttonStyle}>
                Capture Image
              </button>
              <button onClick={stopCamera} style={buttonStyle}>
                Stop Camera
              </button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div style={{ marginTop: '20px' }}>
            <h3>Captured Image:</h3>
            {/* คุณตัดสินใจใช้ img ธรรมดา ดังนั้นไม่ต้อง import Image component */}
            <img src={capturedImage} alt="Captured" style={capturedImageStyle} />
            <p>Image data (Base64):</p>
            <textarea
              readOnly
              value={capturedImage}
              rows={5}
              aria-label="Captured Image Data in Base64" // อันนี้ดีแล้ว
              style={{ width: '100%', resize: 'vertical', fontSize: '10px' }}
            />
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas for image capture */}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid #007bff',
  backgroundColor: '#007bff',
  color: 'white',
};

const videoStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
  border: '2px solid #ccc',
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto',
};

const capturedImageStyle: React.CSSProperties = {
  maxWidth: '100%',
  height: 'auto',
  border: '2px solid #28a745',
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto',
};
// v.1.1.4 ======================================================================

// v.1.1.3 ======================================================================
// app/page.tsx
// 'use client';

// import Image from "next/image";
// import { useLiff } from '../lib/useLiff';
// // ไม่จำเป็นต้อง import liff ตรงนี้แล้ว เพราะ handleLogout จัดการให้แล้ว
// // import liff from '@line/liff';

// export default function Home() {
//   const { liffProfile, isLoading, error, scanResult, handleScan, isScanning, handleLogout } = useLiff(); // รับ handleLogout มาด้วย

//   if (isLoading) {
//     return (
//       <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//           <p>Loading LIFF...</p>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//           <p className="text-red-500">Error: {error}</p>
//           <p>Please ensure your LIFF ID is correct and the app is opened within LINE.</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="font-sans grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       {liffProfile && (
//         <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
//           {liffProfile.pictureUrl && (
//             <img
//               src={liffProfile.pictureUrl}
//               width={50}
//               height={50}
//               alt="Profile picture"
//               className="rounded-full"
//             />
//           )}
//           <div>
//             <p className="text-lg font-bold">ชื่อ: {liffProfile.displayName}</p>
//             <p className="text-sm text-gray-600 dark:text-gray-300">LINE ID: {liffProfile.userId}</p>
//             {liffProfile.statusMessage && (
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Status: {liffProfile.statusMessage}</p>
//             )}
//           </div>
//           <button
//             onClick={handleLogout} // <--- เปลี่ยนมาเรียก handleLogout ที่ได้มาจาก Hook
//             className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       )}

//       <div className="mt-8 text-center">
//         <h1 className="text-2xl font-bold mb-4">LINE LIFF QR Code Scanner</h1>
//         <button
//           onClick={handleScan}
//           className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           📷 สแกน QR Code
//         </button>

//         {isScanning && (
//           <p className="mt-2 text-gray-500">กำลังเปิดกล้อง...</p>
//         )}

//         {scanResult && !isScanning && (
//           <p className="mt-4 text-lg">
//             ผลลัพธ์: <span className="font-semibold">{scanResult}</span>
//           </p>
//         )}
//       </div>

//     </div>
//   );
// }
// v.1.1.3 ======================================================================

// v.1.1.2 ======================================================================
// // app/page.tsx
// 'use client'; // กำหนดให้เป็น Client Component เพราะเราจะใช้ useEffect และ liff SDK

// import Image from "next/image";
// import { useLiff } from '../lib/useLiff';
// import liff from '@line/liff';

// export default function Home() {
  
//   // เรียกใช้ Custom Hook เพื่อเข้าถึง State และฟังก์ชัน
//   const { liffProfile, isLoading, error, scanResult, handleScan, isScanning } = useLiff();

//   if (isLoading) {
//     return (
//       <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//           <p>Loading LIFF...</p>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//           <p className="text-red-500">Error: {error}</p>
//           <p>Please ensure your LIFF ID is correct and the app is opened within LINE.</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="font-sans grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       {liffProfile && (
//         <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
//           {liffProfile.pictureUrl && (
//             // โค้ดที่แก้ไขแล้ว
//             <img
//               src={liffProfile.pictureUrl}
//               width={50} // คุณใช้ width={100} ในคำถามของคุณ แต่ 50 ในโค้ดเก่า ผมใช้ 50 ตามโค้ดเดิมเพื่อคงขนาด
//               height={50} // ควรใส่ height ด้วยเพื่อป้องกัน Layout Shift
//               alt="Profile picture"
//               className="rounded-full"
//             />
//           )}
//           <div>
//             <p className="text-lg font-bold">ชื่อ: {liffProfile.displayName}</p>
//             <p className="text-sm text-gray-600 dark:text-gray-300">LINE ID: {liffProfile.userId}</p>
//             {liffProfile.statusMessage && (
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Status: {liffProfile.statusMessage}</p>
//             )}
//           </div>
//           {/* ปุ่ม Logout (ไม่บังคับ แต่มีไว้ดีกว่า) */}
//           <button
//             onClick={() => liff.logout()}
//             className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm"
//           >
//             Logout
//           </button>
//         </div>
//       )}

//       {/* ส่วนสำหรับ QR Code Scanner */}
//       <div className="mt-8 text-center">
//         <h1 className="text-2xl font-bold mb-4">LINE LIFF QR Code Scanner</h1>
//         <button
//           onClick={handleScan}
//           className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           📷 สแกน QR Code
//         </button>
        
//         {/* ✅ แสดงข้อความกำลังสแกน */}
//         {isScanning && (
//           <p className="mt-2 text-gray-500">กำลังเปิดกล้อง...</p>
//         )}
        
//         {scanResult && !isScanning && (
//           <p className="mt-4 text-lg">
//             ผลลัพธ์: <span className="font-semibold">{scanResult}</span>
//           </p>
//         )}
//       </div>

//     </div>
//   );
// }

// v.1.1.2 ======================================================================

// app/page.tsx
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
