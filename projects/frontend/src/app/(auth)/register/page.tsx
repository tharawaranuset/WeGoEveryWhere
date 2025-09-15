// src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import PasswordInput from "@/components/form/input/PasswordInput";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";
import { toast } from "react-hot-toast";
import { SubmitButton } from "@/components/form/Buttons";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api";

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [policyContent, setPolicyContent] = useState("Loading policy...");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: "length",
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: false,
    },
    {
      id: "lowercase",
      label: "Contains lowercase letters",
      test: (pwd) => /[a-z]/.test(pwd),
      met: false,
    },
    {
      id: "uppercase",
      label: "Contains uppercase letters",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: false,
    },
    {
      id: "number",
      label: "Contains numbers",
      test: (pwd) => /\d/.test(pwd),
      met: false,
    },
    {
      id: "symbol",
      label: "Contains symbols",
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd),
      met: false,
    },
    {
      id: "noRepeat",
      label: "No character repetition (aaa, 111)",
      test: (pwd) => !/(.)\1{2,}/.test(pwd),
      met: false,
    },
    {
      id: "noSequence",
      label: "No number sequence (123, 789)",
      test: (pwd) => !/(?:012|123|234|345|456|567|678|789|890)/.test(pwd),
      met: false,
    },
    {
      id: "noLetterSequence",
      label: "No letter sequence (abc, xyz)",
      test: (pwd) => !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(pwd),
      met: false,
    },
    {
      id: "noKeyboard",
      label: "No keyboard pattern (qwerty, asdf)",
      test: (pwd) => !/(?:qwert|asdf|zxcv|1234|!@#\$)/i.test(pwd),
      met: false,
    },
  ]);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await apiCall('/api/consent/current-policy');
        setPolicyContent(response.content || response.text || "Policy content not available");
      } catch (error) {
        console.error('Failed to load policy:', error);
        setPolicyContent("Failed to load policy. Please try again later.");
      }
    };
    fetchPolicy();
  }, []);

  const validatePassword = (pwd: string) => {
    const updatedRequirements = requirements.map(req => ({
      ...req,
      met: req.test(pwd)
    }));
    setRequirements(updatedRequirements);
    return updatedRequirements.every(req => req.met);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const allRequirementsMet = requirements.every(req => req.met);

  return (
    <main className="font-alt">
      {/* แถวบน: แบรนด์ + โลโก้ */}
      <div className="px-5 pt-4">
        {/* ปุ่ม Back เล็กๆ ใต้แบรนด์ */}
        <Link
          href="/login"
          aria-label="Back to login"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                    bg-[#EB6223] text-black active:scale-95 transition"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      <section className="mx-1 mt-2 rounded-t-[44px] bg-[#FFDCD5] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
      </section>

      {/* การ์ดฟอร์มครีม */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5
        overflow-hidden pb-24 sm:pb-28 ">
        <form className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement & {
            email: HTMLInputElement;
            accept: HTMLInputElement;
          };
          
          const email = form.email.value;
          const accepted = form.accept.checked;

          // Enhanced validation
          if (!email) {
            toast.error("Email is required");
            return;
          }
          
          // Email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
          }

          if (!password) {
            toast.error("Password is required");
            return;
          }
          
          // Check all password requirements
          if (!allRequirementsMet) {
            toast.error("Password must meet all security requirements");
            return;
          }

          if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          
          if (!accepted) {
            toast.error("Please accept the policy");
            return;
          }

          // Store registration data for next step
          const registrationData = { email, password };
          sessionStorage.setItem('registrationData', JSON.stringify(registrationData));
          
          toast.success("Email and password saved. Complete your profile!");
          router.push("/profile-setup");
        }}
        >
          {/* E-mail */}
          <FormInput name="email" label="Email" type="email" placeholder="you@example.com" />

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              className="mt-1 w-full rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#EB6223] focus:outline-none focus:ring-2 focus:ring-[#EB6223]/20"
              placeholder="Enter your password"
            />
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="rounded-2xl bg-white/50 p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  allRequirementsMet ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {allRequirementsMet && <FaCheck className="text-white text-xs" />}
                </div>
                <span className={`text-sm font-semibold ${
                  allRequirementsMet ? 'text-green-600' : 'text-gray-600'
                }`}>
                  Password Requirements {allRequirementsMet ? '✓' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500' : 'bg-red-400'
                    }`}>
                      {req.met ? (
                        <FaCheck className="text-white text-xs" />
                      ) : (
                        <FaTimes className="text-white text-xs" />
                      )}
                    </div>
                    <span className={`text-xs ${
                      req.met ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#EB6223] focus:outline-none focus:ring-2 focus:ring-[#EB6223]/20"
              placeholder="Confirm your password"
            />
            {confirmPassword && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  password === confirmPassword ? 'bg-green-500' : 'bg-red-400'
                }`}>
                  {password === confirmPassword ? (
                    <FaCheck className="text-white text-xs" />
                  ) : (
                    <FaTimes className="text-white text-xs" />
                  )}
                </div>
                <span className={`text-xs ${
                  password === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            )}
          </div>

          {/* กล่อง policy เลื่อนในตัว */}
          <div className="mt-4">
            <div className="rounded-3xl bg-[#D7D0D0]/80 p-4 h-36 overflow-auto text-center text-sm font-semibold text-gray-800">
              {policyContent}
            </div>
          </div>

          {/* checkbox policy */}
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="accept"
              required
              className="size-4 accent-[#F39C12]"
            />
            <span className="font-semibold">I accept the policy</span>
          </label>

          <SubmitButton
            text="Next"
            className={`
              mt-4 w-full rounded-3xl border border-black px-4 py-2.5 text-base font-bold text-black
              transition-all duration-200
              ${allRequirementsMet && password === confirmPassword
                ? 'bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95'
                : 'bg-gray-300 cursor-not-allowed opacity-60'
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]
            `}
          />
        </form>
      </div>
    </main>
  );
}