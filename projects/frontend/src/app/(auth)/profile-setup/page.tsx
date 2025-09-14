// src/app/(auth)/profile-setup/page.tsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";
import PhotoPicker from "@/components/form/PhotoPicker";
import FormSelect from "@/components/form/input/FormSelect";
import { toast } from "react-hot-toast";
import { apiCall } from "@/utils/api";

type HtmlDateInput = HTMLInputElement & { showPicker?: () => void };

export default function ProfileSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
            name="photo"
            size={112}
            rounded="full"
            accept="image/*"
            caption="Upload your profile photo"
          />
        </div>

        {/* ฟอร์ม */}
        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);

            try {
              const formData = new FormData(e.currentTarget);
              // Get registration data from previous step
              const registrationData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');
              
              // Validation
              const firstName = formData.get('firstName') as string;
              const lastName = formData.get('lastName') as string;
              const telephoneNumber = formData.get('telephoneNumber') as string;
              const bio = formData.get('bio') as string;
              const birthdate = formData.get('birthdate') as string;
              const sex = formData.get('sex') as string;

              if (!firstName || !lastName || !telephoneNumber || !bio || !birthdate || !sex) {
                toast.error("Please fill in all required fields");
                return;
              }
              
              // Combine all data for API
              const payload = {
                // From registration page
                email: registrationData.email,
                password: registrationData.password,
                // From profile setup page
                firstName,
                lastName,
                telephoneNumber,
                bio,
                birthdate,
                sex,
              };

              console.log('Sending registration data:', payload);

              // Call registration API
              const result = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
              });

              console.log('Registration successful:', result);

              if (result.success) {
                toast.success('Registration successful!');
                sessionStorage.removeItem('registrationData');
                router.push('/dashboard'); // Or wherever you want to redirect
              } else {
                toast.error(result.error || 'Registration failed');
              }

            } catch (error) {
              console.error('Registration error:', error);
              toast.error('Registration failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <FormInput name="firstName" type="text" label="First name" />
          <FormInput name="lastName"  type="text" label="Last name" />

          {/* Birth date + ปุ่มไอคอนเปิดปฏิทิน */}
          <div className="mb-0">
            <label htmlFor="birthdate" className="text-sm font-semibold">Birth date</label>
            <div className="relative mt-1">
              <FormInput
                ref={dateRef as any}
                name="birthdate"
                type="date"
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
          <FormSelect
              name="sex"
              label="Sex"
              defaultValue=""
              options={[
                { label: "Select…", value: "", disabled: true },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
                { label: "Other", value: "other" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
          />

          <FormInput name="telephoneNumber" type="tel" label="Telephone" />
          <FormInput name="bio"  type="text" label="Bio" />

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full rounded-3xl border border-black px-4 py-2.5
                       text-base font-bold text-black transition hover:bg-[#F2C6C6] active:scale-95
                       ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFDCD5]'}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}