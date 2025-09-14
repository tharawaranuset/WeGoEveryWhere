import CreateEventFormClient from "@/components/client/CreateEventFormClient";
import { Navbar } from "@/components/navbar/Navbar";

export default function CreateEventPage() {
  return (
    <div className="min-h-dvh w-full flex flex-col">
      <main className="flex-1 flex justify-center pt-2 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <section className="relative w-[360px] max-w-full pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0">
            <div className="min-w-65 rounded-full border border-black/60 bg-[var(--color-brand-primary)] px-12 py-3 text-center shadow-sm">
              <h1 className="translate-y-[-20%] text-[26px] font-bold tracking-wide">
                Create Event
              </h1>
            </div>
          </div>

          <div className="relative rounded-[28px] border border-black/50 bg-[var(--color-brand-secondary)] shadow-[0_6px_0_#00000020] z-10">
            {/* ฟอร์ม client: ไม่ redirect, toast เด้ง, แสดง zod error รายฟิลด์ */}
            <CreateEventFormClient />
          </div>
        </section>
      </main>

      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
