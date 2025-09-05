import type { Metadata } from "next";
// 1. เปลี่ยน import จาก Geist เป็น Urbanist
import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// 2. ตั้งค่า Urbanist (ลบของเก่าที่เป็น Geist ออก)
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

// อัปเดต metadata ให้ตรงกับโปรเจกต์ของคุณ
export const metadata: Metadata = {
  title: "WeGo EveryWhere",
  description: "Welcome to our community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // 3. อัปเดต className ให้ใช้ variable ของ urbanist
        className={`${urbanist.variable} font-sans antialiased`}
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}