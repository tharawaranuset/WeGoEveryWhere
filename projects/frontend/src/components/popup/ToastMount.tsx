"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ToastMount() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const type = sp.get("toast"); // "success" | "error" | ...
    const msg = sp.get("msg");

    if (!type) return;

    if (type === "success") toast.success(msg || "Success!");
    else if (type === "error") toast.error(msg || "Something went wrong.");
    else toast(msg || "Notice");

    // ล้าง query ออกจาก URL (ไม่ให้เด้งซ้ำ)
    router.replace(window.location.pathname);
  }, [sp, router]);

  return null;
}
