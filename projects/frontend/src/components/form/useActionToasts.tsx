// /components/form/shared/useActionToasts.ts
"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

/**
 * Hook กลางสำหรับโชว์ toast จากผลลัพธ์ action
 * - ถ้ามี state.message จะใช้ข้อความนั้น
 * - ถ้าไม่มี message:
 *    - ok === true -> ใช้ successText (ถ้ามี)
 *    - ok === false หรือมี errors -> ใช้ errorText (ถ้ามี)
 */
export function useActionToasts<
  T extends { ok: boolean; message?: string; errors?: any }
>(
  state: T | undefined,
  opts?: {
    successText?: string;
    errorText?: string;
    onSuccess?: () => void;
    onError?: () => void;
  }
) {
  useEffect(() => {
    if (!state) return;

    const hasErrors = !!state.errors;
    if (state.message) {
      if (state.ok) {
        toast.success(state.message);
        opts?.onSuccess?.();
      } else {
        toast.error(state.message);
        opts?.onError?.();
      }
      return;
    }

    if (state.ok && opts?.successText) {
      toast.success(opts.successText);
      opts?.onSuccess?.();
    } else if ((!state.ok || hasErrors) && opts?.errorText) {
      toast.error(opts.errorText);
      opts?.onError?.();
    }
  }, [state?.ok, state?.message, state?.errors]);
}
