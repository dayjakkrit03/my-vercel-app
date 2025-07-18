// app/contexts/LiffContext.tsx
"use client"; // แจ้งให้ Next.js รู้ว่านี่คือ Client Component

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Liff } from "@line/liff";

interface LiffContextType {
  liff: Liff | null;
  liffError: string | null;
  isLiffInitialized: boolean;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export function LiffProvider({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLiffInitialized, setIsLiffInitialized] = useState<boolean>(false);

  useEffect(() => {
    // โหลด LIFF SDK แบบ Dynamic เพื่อเลี่ยงปัญหา SSR
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({
            liffId: "2007752233-1LlOZY09", //process.env.NEXT_PUBLIC_LIFF_ID!, // ใช้ LIFF ID ของคุณ
          })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
            setIsLiffInitialized(true);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
            setIsLiffInitialized(true); // ตั้งเป็น true แม้ init ล้มเหลว เพื่อไม่ให้แอปค้าง
          });
      })
      .catch((error) => {
        console.error("Failed to load LIFF SDK:", error);
        setLiffError("Failed to load LIFF SDK.");
        setIsLiffInitialized(true);
      });
  }, []);

  return (
    <LiffContext.Provider value={{ liff: liffObject, liffError, isLiffInitialized }}>
      {children}
    </LiffContext.Provider>
  );
}

export function useLiff() {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
}