"use client";

import Navbar from "@/components/navbar/Navbar";
import { ConfirmProvider, useConfirm } from "@/components/popup/ConfirmProvider";
import { toastError, toastSuccess } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiBell } from "react-icons/fi";

export default function ProfilePage() {
    const confirm = useConfirm();
    const onSignOut = async () => {
        const ok = await confirm({
        title: "Are you sure to sign out your account?",
        subtitle: " ",
        confirmText: "Sign out",
        cancelText: "Cancel", 
        });
        if (!ok) return;

        try {
            // จำลอง API call ใช้ setTimeout แทน
            await new Promise((resolve) => setTimeout(resolve, 1000)); 

            toast.success('Successfully Sign out')
        } catch {
            toast.error("Unsuccessfully, try again.")
        }
    };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are you sure to delete your account?",
      subtitle: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger", 
    });
    if (!ok) return;

    try {
        // จำลอง API call ใช้ setTimeout แทน
        await new Promise((resolve) => setTimeout(resolve, 1000)); 

        toast.success('Successfully Delete')
    } catch {
        toast.error("Unsuccessfully, try again.")
    }
  };

  return (
    <div> 
    <main className="min-h-screen bg-white px-4 py-6 font-alt">
      {/* Header gradient card */}
      <section className="relative rounded-[32px] bg-gradient-to-br from-[#FFD5C7] to-[#F7A79A] p-5 shadow-sm">
        {/* Title + bell */}
        <div className="flex items-start justify-between">
          <h1 className="text-[28px] font-bold leading-[1.05] tracking-tight text-[#2E2E2E]">
            Your Profile
          </h1>
          <button
            aria-label="Notifications"
            className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow"
          >
            <FiBell className="text-[#2E2E2E]" size={20} />
          </button>
        </div>

        {/* Profile pill */}
        <div className="mt-6 flex items-center gap-3">
        {/* avatar */}
        <div className="relative h-[96px] w-[96px] rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-white shrink-0">
            <Image
            src="/images/profile_image.png"
            alt="profile"
            fill
            sizes="96px"
            className="object-cover"
            />
        </div>

        {/* pill */}
        <div className="-ml-6 flex-1 rounded-[28px] bg-white px-6 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <p className="text-[20px] font-bold text-[#2E2E2E]">Gabriel Smith</p>
            <Link
            href="/profile/edit"
            className="text-sm underline decoration-[#BFBFBF] underline-offset-2 text-[#7A7A7A] hover:text-[#2E2E2E]"
            >
            Edit your profile
            </Link>
        </div>
        </div>

      </section>

      {/* Spacer area */}
      <div className="h-[5vh]" />

      {/* Bottom actions */}
      <div className="mx-auto mb-2 mt-auto flex max-w-[520px] items-center justify-between gap-4">
        <button
          onClick={onSignOut}
          className="h-12 flex-1 rounded-full bg-[#D9D0CF] px-6 text-[16px] font-semibold text-black shadow hover:scale-[1.02] transition"
        >
          Sign Out
        </button>

        <button
          onClick={onDelete}
          className=" whitespace-nowrap h-12 flex-1 rounded-full bg-[#EB8B86] px-6 text-[16px] font-semibold text-black shadow hover:scale-[1.02] transition"
        >
          Delete Account
        </button>
      </div>
      
    </main>
    <footer className="sticky bottom-[-6px] px-1 pb-[env(safe-area-inset-bottom)]">
            <Navbar />
      </footer> 
    </div>
    
  );
}
