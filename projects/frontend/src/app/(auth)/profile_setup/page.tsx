// src/app/(auth)/profile-setup/page.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import FormInput from "@/components/form/FormInput";
import PhotoPicker from "@/components/form/PhotoPicker";

type HtmlDateInput = HTMLInputElement & { showPicker?: () => void };

export default function ProfileSetupPage() {
  const router = useRouter();

  /* ---------- Date picker ---------- */
  const dateRef = useRef<HtmlDateInput | null>(null);
  const openDate = () => {
    const el = dateRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else { el.focus(); el.click(); }
  };
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="font-alt">
      <Link
        href="/register"
        aria-label="Back to register"
        className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                   bg-[#EB6223] text-black active:scale-95 transition"
      >
        <ArrowLeft size={16} />
      </Link>

      {/* หัวข้อ */}
      <section className="mx-5 mt-3 rounded-t-[44px] bg-[#FFDCD5] px-5 pt-6 pb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Profile Setup</h2>
      </section>

      {/* การ์ดฟอร์ม */}
      <div className="relative z-10 -mt-6 mx-4 rounded-t-[44px] bg-[#FFF8F0] p-5 shadow overflow-hidden">
        {/* วงกลมอัปโหลดรูป */}
        <div className="flex flex-col items-center">
          <PhotoPicker
            name="photo"                     // สำคัญ: ชื่อฟิลด์สำหรับ FormData.get("photo")
            size={112}                       // ปรับได้
            rounded="full"
            accept="image/*"
            caption="Upload your profile photo"
            // onChange={(file, preview) => { ...ถ้าต้องทำอย่างอื่นเพิ่ม }}
          />
        </div>

        {/* ฟอร์ม */}
        <form
          className="mt-5 space-y-4"
          encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();                 // กันรีเฟรช
            const fd = new FormData(e.currentTarget);
            // TODO: ถ้าจะส่งไป API: await fetch('/api/profile-setup', { method:'POST', body: fd })
            router.push("/profile-setup/next");  // ไปหน้าถัดไป
          }}
        >
          <FormInput name="firstName" type="text" label="First name" required />
          <FormInput name="lastName"  type="text" label="Last name"  required />

          {/* Birth date + ปุ่มไอคอนเปิดปฏิทิน */}
          <div>
            <label htmlFor="birthDate" className="text-sm font-semibold">Birth date</label>
            <div className="relative mt-1">
              <FormInput
                ref={dateRef as any}
                id="birthDate"
                name="birthDate"
                type="date"
                max={today}
                required
                className="pr-11 appearance-none
                          [&::-webkit-calendar-picker-indicator]:hidden
                          [&::-webkit-clear-button]:hidden
                          [&::-webkit-inner-spin-button]:hidden
                          [-moz-appearance:textfield]"
              />
              <button
                type="button"
                onClick={openDate}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                aria-label="Open date picker"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="text-sm font-semibold">Sex</label>
            <div className="relative mt-1">
              <select
                id="sex"
                name="sex"
                required
                defaultValue=""
                className="w-full appearance-none rounded-3xl border border-black bg-white
                           px-4 pr-10 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                <option value="" disabled>Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              />
            </div>
          </div>

          <FormInput name="tel" type="tel" inputMode="tel" label="Telephone" required />
          <FormInput name="bio"  type="text" label="Bio"  required />

          <button
            type="submit"
            className="mt-2 w-full rounded-3xl border border-black bg-[#FFDCD5] px-4 py-2.5
                       text-base font-bold text-black transition hover:bg-[#F2C6C6] active:scale-95"
          >
            Next
          </button>
        </form>
      </div>
    </main>
  );
}
