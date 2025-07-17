// v.1.1.2 ======================================================================
// app/page.tsx
'use client'; // กำหนดให้เป็น Client Component เพราะเราจะใช้ useEffect และ liff SDK

import Image from "next/image";
import { useLiff } from '../lib/useLiff';
import liff from '@line/liff';

export default function Home() {
  
  // เรียกใช้ Custom Hook เพื่อเข้าถึง State และฟังก์ชัน
  const { liffProfile, isLoading, error, scanResult, handleScan, isScanning } = useLiff();

  if (isLoading) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <p>Loading LIFF...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <p className="text-red-500">Error: {error}</p>
          <p>Please ensure your LIFF ID is correct and the app is opened within LINE.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {liffProfile && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
          {liffProfile.pictureUrl && (
            // โค้ดที่แก้ไขแล้ว
            <img
              src={liffProfile.pictureUrl}
              width={50} // คุณใช้ width={100} ในคำถามของคุณ แต่ 50 ในโค้ดเก่า ผมใช้ 50 ตามโค้ดเดิมเพื่อคงขนาด
              height={50} // ควรใส่ height ด้วยเพื่อป้องกัน Layout Shift
              alt="Profile picture"
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-lg font-bold">ชื่อ: {liffProfile.displayName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">LINE ID: {liffProfile.userId}</p>
            {liffProfile.statusMessage && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Status: {liffProfile.statusMessage}</p>
            )}
          </div>
          {/* ปุ่ม Logout (ไม่บังคับ แต่มีไว้ดีกว่า) */}
          <button
            onClick={() => liff.logout()}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm"
          >
            Logout
          </button>
        </div>
      )}

      {/* ส่วนสำหรับ QR Code Scanner */}
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold mb-4">LINE LIFF QR Code Scanner</h1>
        <button
          onClick={handleScan}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          📷 สแกน QR Code
        </button>
        
        {/* ✅ แสดงข้อความกำลังสแกน */}
        {isScanning && (
          <p className="mt-2 text-gray-500">กำลังเปิดกล้อง...</p>
        )}
        
        {scanResult && !isScanning && (
          <p className="mt-4 text-lg">
            ผลลัพธ์: <span className="font-semibold">{scanResult}</span>
          </p>
        )}
      </div>

    </div>
  );
}

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
