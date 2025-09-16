// src/app/(whatever)/edit-profile/page.tsx
"use client";

import { useRef, useState ,useEffect} from "react";
import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { EditInput } from "@/components/form/input/EditInput"; // ✅ ใช้ EditInput ใหม่
import FormSelect from "@/components/form/input/FormSelect";
import { Calendar } from "lucide-react";
import { SubmitButton } from "@/components/form/Buttons";
import { UpdateUserDto, UserService } from "@/lib/api";


type HtmlDateInput = HTMLInputElement & { showPicker?: () => void };

export default function EditProfilePage() {
  // const birthRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    sex: "",
    telephoneNumber: "",
    bio: ""
    });

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const data = await UserService.userControllerGetMe();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load profile data");
    }
  };
  fetchUserData();
}, []);


  const dateRef = useRef<HtmlDateInput | null>(null);
  const openDate = () => {
    const el = dateRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else { el.focus(); el.click(); }
  };
  const today = new Date().toISOString().slice(0, 10);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (submitting) return;
  setSubmitting(true);

  try {
    const form = e.currentTarget;
    const fd = new FormData(form);

    // แปลง FormData เป็น object สำหรับ API
    const body: UpdateUserDto = {
  firstName: fd.get("firstName") as string || undefined,
  lastName: fd.get("lastName") as string || undefined,
  birthdate: fd.get("birthDate") as string || undefined,   // ชื่อตรง
  sex: fd.get("sex") as UpdateUserDto.sex || undefined,    // cast enum
  telephoneNumber: fd.get("telephone") as string || undefined, // ชื่อตรง
  bio: fd.get("bio") as string || undefined,
};

    // เรียก API จริง
    await UserService.userControllerUpdate(body);

    toast.success("Successfully Edited");
  } catch (err) {
    console.error(err);
    toast.error("Unsuccessfully Edited, try again");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="min-h-screen py-1 font-alt bg-white">
      <div className="mx-auto w-full px-2">
        {/* Back + Title pill */}
        <div className="mt-10 mb-4 relative z-10">
          <button
            aria-label="Back"
            onClick={() => history.back()}
            className="absolute left-0 top-1/2 -translate-y-[60%] z-20 w-10 h-10 rounded-full bg-[#EB6223] flex items-center justify-center shadow hover:scale-105 transition"
          >
            <FiArrowLeft className="text-[#000000]" size={17} />
          </button>
          <div className="flex justify-center">
            <div className="absolute -bottom-6 z-10 px-10 py-3 rounded-[60px] bg-[#FFDCD5] shadow-[0_6px_0_rgba(0,0,0,0.07)]">
              <span className="text-2xl font-semibold text-[#1f1f1f]">
                Edit Profile
              </span>
            </div>
          </div>
        </div>

        {/* Card */}
        <section className="relative z-20  mx-4 bg-[#FFF5E9] rounded-t-[60px] p-5 shadow">
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
          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              // กันกรณีกด Enter แล้ว submit
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <EditInput
              name="firstName"
              type="text"
              label="First name"
              defaultValue = {userData.firstName}
              required
            />

            <EditInput
              name="lastName"
              type="text"
              label="Last name"
              defaultValue={userData.lastName}
              required
            />

           {/* Birth date */}
          <div className="mb-0">
            <label htmlFor="birthDate" className="text-sm font-semibold">Birth date</label>
            <div className="relative">
              <EditInput
                ref={dateRef as any}
                id="birthDate"
                name="birthDate"
                type="date"
                max={today}
                containerClassName="mb-0" 

                required
                defaultValue={userData.birthdate}
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

            <FormSelect
              name="sex"
              label="Sex"
              required
              className = "bg-gray-200"
              containerClassName="mb-2.5"
              value={userData.sex || ""}
              onChange={(e) => {
                setUserData({...userData, sex: e.target.value});
              }}
              options={[
                { label: "Select", value: "" , disabled: true  },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
                { label: "Other", value: "other" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
          />

            <EditInput
              name="telephone"
              type="tel"
              inputMode="tel"
              label="Telephone"
              defaultValue={userData.telephoneNumber}
              placeholder="xxx-xxx-xxxx"
              required
            />

            <EditInput
              name="bio"
              type="bio"
              label="Bio"
              defaultValue={userData.bio}
              placeholder="we love cat"
              required
            />

            {/* Save */}
            <SubmitButton
              text="Save"
              className="w-full mt-2 mb-2 rounded-[24px] bg-[#FFDCD5] text-[#2E2E2E]
             font-extrabold py-3 transition border border-black 
             hover:bg-[#FFBFB3] hover:shadow-lg active:scale-95w-full mt-2 mb-2 whitespace-nowrap h-12 flex-1
             rounded-[24px] bg-[#FFDCD5] text-[#2E2E2E]
             font-extrabold text-[16px] px-6 shadow
             border border-black 
             hover:scale-[1.02] hover:bg-[#FFBFB3] hover:shadow-lg
             active:scale-95 transition"
            />

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
