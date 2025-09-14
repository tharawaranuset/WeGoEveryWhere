// /lib/forms.ts

// แปลง FormData -> object เพื่อ repopulate ตอน validate ไม่ผ่าน
export function toFields(formData: FormData) {
  const obj: Record<string, string> = {};
  for (const [k, v] of formData.entries())
    obj[k] = typeof v === "string" ? v : "";
  return obj;
}

// สถานะกลางของ action state (เพิ่ม fields สำหรับเติมค่ากลับ)
export type EventStateWithFields<
  TBase extends { ok: boolean; errors?: any; message?: string }
> = TBase & { fields?: Record<string, string> };

// โครงของค่าฟอร์ม (create/edit ใช้ร่วมกัน)
export type EventFormValues = {
  photo?: string | null;
  eventName?: string;
  eventDate?: string;
  location?: string;
  details?: string;
  capacity?: string | number;
  status?: "publish" | "unpublish";
};
