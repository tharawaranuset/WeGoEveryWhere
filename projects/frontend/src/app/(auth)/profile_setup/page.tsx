// src/app/(auth)/profile-setup/page.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";
import PhotoPicker from "@/components/form/PhotoPicker";
import FormSelect from "@/components/form/input/FormSelect";
import { Calendar28 } from "@/components/form/input/DatePicker";


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
        className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full 
                   bg-[#EB6223] text-black active:scale-95 transition"
      >
        <ArrowLeft size={17} />
      </Link>

      {/* หัวข้อ */}
      <section className="mx-5 mt-3 rounded-t-[44px] bg-[#FFDCD5] px-5 pt-6 pb-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">Profile Setup</h2>
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
          <FormInput name="firstName" type="text" label="First name" className="bg-white border border-black" requried/>
          <FormInput name="lastName"  type="text" label="Last name" className="bg-white border border-black" requried />

          {/* Birth date + ปุ่มไอคอนเปิดปฏิทิน */}
          <Calendar28
                  name="birthdate"
                  label="Birth Date"
                  placeholder="Month DD,YYYY"
                  required
                  className="bg-white border border-black w-full rounded-full
                              h-10 px-4 text-[15px] leading-none"
                  disableTyping
          />

          {/* Sex */}
          <FormSelect
              name="sex"
              label="Sex"
              required
              defaultValue=""  // ให้ placeholder ถูกเลือกเริ่มต้น
              options={[
                { label: "Select…", value: "", disabled: true },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
                { label: "Other", value: "other" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
          />

          <FormInput name="tel" type="tel" label="Telephone" className="bg-white border border-black" requried />
          <FormInput name="bio"  type="text" label="Bio" className="bg-white border border-black" requried />

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
