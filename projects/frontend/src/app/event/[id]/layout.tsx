import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#FFF1EA] px-4 pt-6 pb-4 shadow">
        <div className="flex items-center gap-3">
          <Link
            href="/event"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD5C6] text-[#EB6223]"
            aria-label="Back"
          >
            <ChevronLeft />
          </Link>
          <div>
            <div className="text-sm text-neutral-500">
              Events / Event Detail
            </div>
            <div className="font-extrabold leading-tight text-[#EB6223]">
              WeGo
              <span className="block -mt-1 text-[#F18A6E]">EveryWhere</span>
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
