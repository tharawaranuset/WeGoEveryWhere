"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { useConfirm } from "@/components/popup/ConfirmProvider";

/** รับ server action (bind id แล้ว) แล้ว submit ผ่านฟอร์มภายใน component */
export default function DeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const confirm = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);

  // cross-browser: ใช้ requestSubmit ถ้ามี, ไม่งั้นสร้างปุ่ม submit ชั่วคราว
  const safeRequestSubmit = (form: HTMLFormElement) => {
    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
    } else {
      const tmp = document.createElement("button");
      tmp.type = "submit";
      tmp.style.display = "none";
      form.appendChild(tmp);
      tmp.click();
      form.removeChild(tmp);
    }
  };

  const onClick = async () => {
    const ok = await confirm({
      title: "Delete this event?",
      subtitle: "Are you sure you want to delete this event?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;
    const form = formRef.current;
    if (form) safeRequestSubmit(form);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Delete event"
        className="h-11 w-11 rounded-full flex items-center justify-center 
                   bg-transparent border-0 p-0 hover:bg-transparent 
                   focus-visible:ring-2 focus-visible:ring-[var(--color-brand-redbutton)]/40"
        title="Delete event"
      >
        <Trash2 className="h-7 w-7 text-[var(--color-brand-redbutton)]" />
      </button>

      {/* ฟอร์มสำหรับ server action ของการลบ */}
      <form ref={formRef} action={action} />
    </>
  );
}
