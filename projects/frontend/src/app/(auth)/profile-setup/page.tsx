// src/app/(auth)/profile-setup/page.tsx - COMPLETE VALIDATION
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
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

  // Calculate max date for 20+ years old
  const twentyYearsAgo = new Date();
  twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
  const maxDate = twentyYearsAgo.toISOString().slice(0, 10);

  const validateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 20;
    }
    return age >= 20;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        if (!value) return "First name is required";
        if (value.length > 50) return "First name must be 50 characters or less";
        return null;
      
      case 'lastName':
        if (!value) return "Last name is required";
        if (value.length > 50) return "Last name must be 50 characters or less";
        return null;
      
      case 'telephoneNumber':
        if (value && value.length > 20) return "Phone number must be 20 characters or less";
        return null;
      
      case 'bio':
        // No specific length limit for TEXT type, but reasonable validation
        if (value && value.length > 1000) return "Bio must be 1000 characters or less";
        return null;
      
      case 'birthdate':
        if (!value) return "Birth date is required";
        if (!validateAge(value)) return "You must be at least 20 years old to register";
        return null;
      
      case 'sex':
        if (!value) return "Please select your gender";
        if (value.length > 10) return "Invalid gender selection";
        return null;
      
      default:
        return null;
    }
  };

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
              
              if (!registrationData.email || !registrationData.password) {
                toast.error("Registration data missing. Please start from the beginning.");
                router.push("/register");
                return;
              }

              // Extract form data with validation
              const firstName = formData.get('firstName') as string;
              const lastName = formData.get('lastName') as string;
              const telephoneNumber = formData.get('telephoneNumber') as string;
              const bio = formData.get('bio') as string;
              const birthdate = formData.get('birthdate') as string;
              const sex = formData.get('sex') as string;

              // Validate each field with specific error messages
              const firstNameError = validateField('firstName', firstName);
              if (firstNameError) {
                toast.error(firstNameError);
                return;
              }

              const lastNameError = validateField('lastName', lastName);
              if (lastNameError) {
                toast.error(lastNameError);
                return;
              }

              const phoneError = validateField('telephoneNumber', telephoneNumber);
              if (phoneError) {
                toast.error(phoneError);
                return;
              }

              const bioError = validateField('bio', bio);
              if (bioError) {
                toast.error(bioError);
                return;
              }

              const birthdateError = validateField('birthdate', birthdate);
              if (birthdateError) {
                toast.error(birthdateError);
                return;
              }

              const sexError = validateField('sex', sex);
              if (sexError) {
                toast.error(sexError);
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
                telephoneNumber: telephoneNumber || null, // Allow empty string to be null
                bio: bio || null, // Allow empty string to be null
                birthdate,
                sex,
              };

              console.log('Sending registration data:', payload);

              // Call registration API
              const result = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
              });

              console.log('Registration result:', result);

              if (result.success) {
                toast.success('Registration successful! Welcome to WeGoEveryWhere!');
                sessionStorage.removeItem('registrationData');
                router.push('/dashboard'); // Or wherever you want to redirect
              } else {
                // Handle specific backend errors
                if (result.error === 'Email already registered') {
                  toast.error("This email is already registered. Please use a different email or try logging in.");
                } else if (result.details && result.details.includes('age_check')) {
                  toast.error("You must be at least 20 years old to register.");
                } else if (result.details && result.details.includes('email')) {
                  toast.error("Invalid email format or email already exists.");
                } else {
                  toast.error(result.error || 'Registration failed. Please check your information and try again.');
                }
              }

            } catch (error: any) {
              console.error('Registration error:', error);
              
              // Handle specific API errors
              if (error.status === 400) {
                toast.error("Invalid information provided. Please check all fields and try again.");
              } else if (error.status === 409) {
                toast.error("Email already registered. Please use a different email.");
              } else {
                toast.error('Registration failed. Please check your connection and try again.');
              }
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <FormInput name="firstName" type="text" label="First name" placeholder="Enter your first name"  className="bg-white border border-black" required />
          <FormInput name="lastName"  type="text" label="Last name" placeholder="Enter your last name" className="bg-white border border-black" required/>

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
                          [-moz-appearance:textfield]
                          bg-white border border-black required"
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
            <p className="text-xs text-gray-600 mt-1">You must be at least 20 years old to register</p>
          </div>

          {/* Sex */}
          <FormSelect
              name="sex"
              label="Gender"
              defaultValue=""
              options={[
                { label: "Select your gender", value: "", disabled: true },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
                { label: "Other", value: "other" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
          />

          <FormInput name="telephoneNumber" type="tel" label="Phone Number (Optional)" placeholder="Enter your phone number" className="bg-white border border-black" required />
          <FormInput name="bio"  type="text" label="Bio (Optional)" placeholder="Tell us about yourself" className="bg-white border border-black" required />

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