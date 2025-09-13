"use client";
import { createContext, useCallback, useContext, useState } from "react";

type ConfirmOptions = {
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
};

type ConfirmContextType = (opts: ConfirmOptions) => Promise<boolean>;
const ConfirmCtx = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(v: boolean) => void>(() => () => {});

  const confirm = useCallback<ConfirmContextType>((o) => { //ค่าdefault
    setOpts({ confirmText: "Confirm", cancelText: "Cancel", variant: "default",...o });
    setOpen(true);
    return new Promise<boolean>((resolve) => setResolver(() => resolve));
  }, []);

  const close = (v: boolean) => {
    setOpen(false);
    resolver(v);
  };
    const baseBtn =
        "h-11 w-full rounded-full font-semibold cursor-pointer select-none " +
        "transition-all duration-200 ease-out " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
        "active:translate-y-[1px] motion-safe:hover:-translate-y-0.5";

    const isDanger = opts?.variant === "danger";
    const confirmBtnClass =
        baseBtn +
        (isDanger
        // DANGER: แดงเข้ม + ฟ้อนท์ขาว + เงา
        ? " border-red-700 bg-[#B71402] text-white " +
        "hover:bg-red-700 focus-visible:ring-red-400 ring-offset-[#FFF5E9] " +
        "shadow-[0_2px_0_rgba(0,0,0,0.15)] motion-safe:hover:shadow-[0_8px_16px_rgba(220,38,38,0.25)]"
        // DEFAULT: ชมพูอ่อน + ดำ
        : " border-black bg-[#FFDCD5] text-black " +
        "hover:opacity-95 focus-visible:ring-black/40 ring-offset-[#FFF5E9] " +
        "shadow-[0_2px_0_rgba(0,0,0,0.08)] motion-safe:hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
    );

    const cancelBtnClass =
        baseBtn +
        " border-black bg-white text-black hover:bg-gray-50 " +
        "focus-visible:ring-black/40 ring-offset-[#FFF5E9] " +
        "shadow-[0_2px_0_rgba(0,0,0,0.06)] motion-safe:hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)]";
    


  return (
    <ConfirmCtx.Provider value={confirm}>
    {children}
    {open && opts && (
        <div className="fixed inset-0 z-[9999] grid place-items-center">
        <div
            className="absolute inset-0 bg-black/40"
            onClick={() => close(false)}
        />
        <div className="relative w-[280px] max-w-sm rounded-[20px] bg-[#FFF5E9] p-6 shadow-xl font-alt ">
            <div className="text-center text-lg leading-tight font-bold">
            {opts.title}
            </div>
            {opts.subtitle && (
            <p className="mt-1 text-sm text-black/70 text-center">
                {opts.subtitle}
            </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
            <button
                onClick={() => close(true)}
                className={confirmBtnClass}
            >
                {opts.confirmText}
            </button>
            <button
                onClick={() => close(false)}
                className= {cancelBtnClass}
            >
                {opts.cancelText}
            </button>
            </div>
        </div>
        </div>
    )}
    </ConfirmCtx.Provider>

  );
}
