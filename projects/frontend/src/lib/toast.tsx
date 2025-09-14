"use client";
import toast from "react-hot-toast";

const Icon = {
  success: (
    <div className="h-6 w-6 rounded-full bg-[#3BA24A] grid place-items-center">
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  ),
  error: (
    <div className="h-6 w-6 rounded-full bg-[#E74C3C] grid place-items-center">
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth="3">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </div>
  ),
  info: (
    <div className="h-6 w-6 rounded-full bg-[#FFD5C7] grid place-items-center">
      <span className="text-[#EB6223] text-sm font-bold">i</span>
    </div>
  ),
};

const Base = (title: string, subtitle?: string) => (
  <div className="flex items-start gap-3">
    {/* ไอคอนจะถูกยัดตอนเรียก */}
    <div className="min-w-0">
      <div className="text-[15px] font-semibold leading-snug">{title}</div>
      {subtitle && <div className="text-[13px] opacity-70 mt-0.5">{subtitle}</div>}
    </div>
  </div>
);

export function toastSuccess(title = "Success", subtitle?: string, ms?: number) {
  toast.custom(
    (t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} flex items-start gap-3`}>
        {Icon.success}
        {Base(title, subtitle)}
      </div>
    ),
    { duration: ms ?? 2200 }
  );
}

export function toastError(title = "Something went wrong", subtitle?: string, ms?: number) {
  toast.custom(
    (t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} flex items-start gap-3`}>
        {Icon.error}
        {Base(title, subtitle)}
      </div>
    ),
    { duration: ms ?? 2600 }
  );
}

export function toastInfo(title: string, subtitle?: string, ms?: number) {
  toast.custom(
    (t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} flex items-start gap-3`}>
        {Icon.info}
        {Base(title, subtitle)}
      </div>
    ),
    { duration: ms ?? 2400 }
  );
}
