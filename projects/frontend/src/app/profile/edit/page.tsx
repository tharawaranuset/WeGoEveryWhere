"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiChevronDown } from "react-icons/fi";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    firstName: "Gabriel",
    lastName: "Smith",
    birthDate: "2000-11-06",
    sex: "Male",
    telephone: "081-999-1234",
  });

  const birthRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openDatePicker = () => {
    const el = birthRef.current;
    if (!el) return;
    
    if (typeof el.showPicker === "function") {
  
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] py-6 px-4 font-sans">
      <div className="mx-auto w-full max-w-[420px] bg-white rounded-3xl shadow p-5">
        {/* Brand */}
        <h1 className="text-[28px] font-extrabold leading-[1.05] tracking-tight">
          <span className="block text-[#EB6223]">WeGo</span>
          <span className="block text-[#EB6223]">EveryWhere</span>
        </h1>

        {/* Back + Title pill */}
        <div className="mt-3 mb-4 relative">
          <button
            aria-label="Back"
            onClick={() => history.back()}
            className="absolute -left-1 -top-1 w-12 h-12 rounded-full bg-[#FFD5C7] flex items-center justify-center shadow hover:scale-105 transition"
          >
            <FiArrowLeft className="text-[#EB6223]" size={22} />
          </button>
          <div className="flex justify-center">
            <div className="px-10 py-3 rounded-2xl bg-[#FFD3CF] shadow-[0_6px_0_rgba(0,0,0,0.07)]">
              <span className="text-2xl font-extrabold text-[#1f1f1f]">
                Edit Profile
              </span>
            </div>
          </div>
        </div>

        {/* Card */}
        <section className="bg-[#FFF5E9] rounded-[24px] p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow bg-white">
              <Image
                src="/images/avatar.png"
                alt="profile"
                width={112}
                height={112}
              />
            </div>
            <button className="mt-3 text-[15px] text-[#606770] underline underline-offset-2">
              Change your profile photo
            </button>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-5">
            {/* First name */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                First name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-2 w-full rounded-full border border-[#2E2E2E] px-5 py-3 text-[18px]"
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Last name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-2 w-full rounded-full border border-[#2E2E2E] px-5 py-3 text-[18px]"
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Birth date
              </label>
              <div className="relative mt-2">
                <input
                  ref={birthRef}
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={onChange}
                  className="date-input appearance-none w-full rounded-full border border-[#2E2E2E] bg-white px-5 pr-12 py-3 text-[18px]"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={openDatePicker}
                  aria-label="Open date picker"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[#F3F4F6] transition"
                >
                  <FiCalendar className="text-[#2E2E2E]" size={20} />
                </button>
              </div>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Sex
              </label>
              <div className="relative mt-2">
                <select
                  name="sex"
                  value={form.sex}
                  onChange={onChange}
                  className="w-full appearance-none rounded-full border border-[#2E2E2E] bg-white px-5 pr-12 py-3 text-[18px]"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2E2E2E]" />
              </div>
            </div>

            {/* Telephone */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Telephone
              </label>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF1FE] text-[#2E2E2E] px-4 py-2.5 border border-[#EFF1FE] text-[16px]">
                  🇹🇭 +66
                </span>
                <input
                  name="telephone"
                  value={form.telephone}
                  onChange={onChange}
                  placeholder="081-999-1234"
                  className="flex-1 rounded-full border border-[#2E2E2E] bg-white px-5 py-3 text-[18px]"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="w-full mt-1 rounded-full bg-[#F6C6BF] text-[#2E2E2E] font-extrabold py-3 hover:brightness-95 transition"
            >
              Save
            </button>

            {/* Change password */}
            <button
              type="button"
              className="block mx-auto text-[14px] text-[#8B8E94] underline underline-offset-2"
            >
              Change Password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
