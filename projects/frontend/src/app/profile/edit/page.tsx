"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    firstName: "Gabriel",
    lastName: "Smith",
    birthDate: "2000-11-06",
    sex: "Male",
    telephone: "081-999-1234",
    bio: "love cat"
  });

  const birthRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
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

    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
        // ถ้ายังไม่ต่อ API: จำลองรอ 600ms
        await new Promise((r) => setTimeout(r, 100));
        // ถ้าต่อ API จริงก็:
        // const res = await fetch("/api/profile", { method: "POST", body: JSON.stringify(form) });
        // if (!res.ok) throw new Error("Bad response");
        toast.success('Successfully Edited')
    } catch (err) {
        toast.error('Unsuccessfully Edited, try again')
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-6 font-alt bg-white ">
      <div className="mx-auto w-full  px-2">
        {/* Brand */}
        <h1 className="text-[28px] font-extrabold leading-[1.05] tracking-tight">
          <span className="block text-[#EB6223]">WeGo</span>
          <span className="block text-[#EB6223]">EveryWhere</span>
        </h1>

        {/* Back + Title pill */}
        <div className="mt-10 mb-4 relative z-10">
          <button
            aria-label="Back"
            onClick={() => history.back()}
            className="absolute left-0 top-1/2 -translate-y-[60%] z-20 w-12 h-12 rounded-full bg-[#FFD5C7] flex items-center justify-center shadow hover:scale-105 transition"
          >
            <FiArrowLeft className="text-[#EB6223]" size={22} />
          </button>
          <div className="flex justify-center ">
            <div className="absolute -bottom-6 z-10 px-10 py-3 rounded-[60px] bg-[#FFDCD5] shadow-[0_6px_0_rgba(0,0,0,0.07)] ">
              <span className= "text-2xl font-semibold text-[#1f1f1f]">
                Edit Profile
              </span>
            </div>
          </div>
        </div>

        {/* Card */}
        <section className="relative z-20 bg-[#FFF5E9] rounded-t-[60px] p-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
           <div className="shadow-xl rounded-full">
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <Image
                src="/images/profile_image.png"
                alt="profile"
                width={112}
                height={112}
              />
            </div>
            </div>
            <button className="mt-3 text-[12px] text-[#606770] underline underline-offset-2">
              Change your profile photo
            </button>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* First name */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                First name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-2 w-full rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 py-3 text-[18px] "
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
                className="mt-2 w-full rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 py-3 text-[18px]"
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Birth date
              </label>
              <div className="relative mt-2">
               <div className="mt-2">
                <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={onChange}
                    className="w-full rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 py-3 text-[18px]"
                    suppressHydrationWarning
                />
                </div>
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
                  className="w-full appearance-none rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 pr-12 py-3 text-[18px]"
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
                {/* <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF1FE] text-[#2E2E2E] px-4 py-2.5 border border-[#EFF1FE] text-[16px]">
                  🇹🇭 +66
                </span> */}
                <input
                  name="telephone"
                  value={form.telephone}
                  onChange={onChange}
                  placeholder="081-999-1234"
                  className="flex-1 rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 py-3 text-[18px]"
                />
              </div>
            </div>
            {/* Bio */}
            <div>
              <label className="block text-[15px] font-bold text-[#2E2E2E]">
                Bio
              </label>
              <div className="mt-2 flex items-center gap-3">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  placeholder="love cat"
                  rows={3}
                  className="flex-1 rounded-[30px] border border-[#2E2E2E] bg-[#EEEEEE] px-4 py-3 text-[18px]"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-1 rounded-[24px] bg-[#FFDCD5] text-[#2E2E2E] font-extrabold py-3 transition border border-black ${
                submitting ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"
              }`}
            >
              {submitting ? "Saving..." : "Save"}
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
