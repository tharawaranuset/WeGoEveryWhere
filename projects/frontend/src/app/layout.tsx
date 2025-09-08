import type { Metadata } from "next";
import { Karla, Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";

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
}: {
  children: React.ReactNode;
}) {
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
      >
        {/* Make Phone at the middle */}
        <div className="min-h-dvh flex items-center justify-center p-2 bg-black">
          {/* Phone Frame */}
          <div
            className="
              relative w-[390px] h-[844px] max-h-[calc(100dvh-1rem)]
              overflow-hidden rounded-2xl border shadow-2xl pt-2 pl-2 pr-2 pb-0
            "
            style={{
              background: "var(--color-brand-background)",
              borderColor: "var(--foreground)",
              color: "var(--foreground)",
            }}
          >
            <div className="size-full flex flex-col overflow-hidden pt-[2px] pb-0 pl-[5px] pr-[3px]">
              <div className="flex-1 overflow-auto">{children}</div>
              <footer className="mt-auto">
                <Navbar />
              </footer>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

