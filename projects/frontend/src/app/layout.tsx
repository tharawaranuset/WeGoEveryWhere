import type { Metadata } from "next";
import { Karla, Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeGoEveryWhere",
  description: "by WeGoEveryWhere SE Project Group 4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className={`${karla.variable} ${urbanist.variable} antialiased min-h-dvh bg-black text-white`}
        style={{
          fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* นอกกรอบ: ดำสนิท */}
        <div className="min-h-dvh flex items-center justify-center p-2 bg-black">
          {/* กรอบมือถือ */}
          <div
            className="
              relative w-[390px]
              h-[844px] max-h-[calc(100dvh-1rem)]
              overflow-hidden rounded-2xl border shadow-2xl
            "
            style={{
              background: "var(--color-brand-background)", // พื้นหลังมือถือ = brand
              borderColor: "var(--foreground)", // ขอบ
              color: "var(--foreground)", // ข้อความในกรอบ
            }}
          >
            <div className="size-full flex flex-col overflow-auto p-[5px]">
              <div className="flex-1 overflow-auto">{children}</div>
              <Navbar />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
