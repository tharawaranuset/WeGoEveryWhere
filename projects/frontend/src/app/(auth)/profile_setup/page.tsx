// src/app/(auth)/profile-setup/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, ChevronDown, Upload } from "lucide-react";
import FormInput from "@/components/form/FormInput";
import Link from "next/link";

type HtmlDateInput = HTMLInputElement & { showPicker?: () => void };

export default function ProfileSetupPage() {
  /* ---------- Upload photo (preview) ---------- */
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const openFile = () => fileRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

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
    <main className="font-sans">
      {/* แบรนด์ + โลโก้ + ปุ่มย้อนกลับ */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold leading-tight">
            <span className="block text-[#EB6223]">WeGo</span>
            <span className="block text-[#EB6223]">EveryWhere</span>
          </h1>
          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <Link
          href="/register"
          aria-label="Back to register"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                    bg-[#EB6223] text-black active:scale-95 transition"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      {/* หัวข้อ (ชมพู โค้งด้านบน กว้างเท่าการ์ด) */}
      <section className="mx-4 mt-3 rounded-t-[44px] bg-[#FFDCD5] px-5 pt-5 pb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Profile Setup</h2>
      </section>

      {/* การ์ดฟอร์ม */}
      <div className="relative z-10 -mt-6 mx-4 rounded-t-[44px] bg-[#FFF8F0] p-5 shadow">
        {/* วงกลมอัปโหลดรูป */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={openFile}
            aria-label="Upload your profile photo"
            className="relative h-28 w-28 overflow-hidden rounded-full bg-gray-200 shadow active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-700">
                <Upload />
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
          <p className="mt-3 text-center text-sm font-semibold text-gray-500">
            Upload your profile photo
          </p>
        </div>

        {/* ฟอร์ม */}
        <form className="mt-5 space-y-4">
          <FormInput name="firstName" type="text" label="First name" required />
          <FormInput name="lastName"  type="text" label="Last name"  required />

          {/* Birth date + ปุ่มไอคอนเปิดปฏิทิน */}
          <div>
            <label htmlFor="birthDate" className="text-sm font-semibold">
              Birth date
            </label>
            <div className="relative mt-1">
            <FormInput
                ref={dateRef as any}
                id="birthDate"
                name="birthDate"
                type="date"
                max={today}
                required
                className="pr-11 appearance-none no-native-picker"
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

          {/* Sex (dropdown) */}
          <div>
            <label htmlFor="sex" className="text-sm font-semibold">
              Sex
            </label>
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

          <FormInput
            name="tel"
            type="tel"
            inputMode="tel"
            label="Telephone"
            required
          />

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
