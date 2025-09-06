import "./globals.css";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={urbanist.variable}>
      <body className="bg-brand-background">
        {/* PHONE WRAPPER: กว้างคงที่ + จัดกลาง + สูงเต็ม viewport + เลื่อนแนวตั้งได้ */}
        <div className="mx-auto w-[390px] max-w-[390px] min-h-dvh overflow-x-hidden bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}

