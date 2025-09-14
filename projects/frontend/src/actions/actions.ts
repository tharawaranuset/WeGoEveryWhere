"use server";
import { eventFormSchema } from "@/utils/schemas";

export type EventActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  /** เผื่ออนาคตอยากให้ client redirect ต่อ (เช่น router.push(state.next)) */
  next?: string;
};

/** ดึงค่า photo แบบ backward-compatible:
 * - ถ้ามี photoFile ที่เป็นไฟล์จริง → ใช้อันนี้
 * - ไม่งั้นถ้ามี photoExisting (string) → ใช้อันนี้
 * - ไม่งั้นลองอ่าน field เดิมชื่อ "photo" (อาจเป็น File หรือ string หรือ null)
 */
function extractPhoto(
  formData: FormData,
  base = "photo"
): File | string | null {
  const file = formData.get(`${base}File`);
  if (file instanceof File && file.size > 0) return file;

  const existing = formData.get(`${base}Existing`);
  if (typeof existing === "string" && existing.length > 0) return existing;

  // fallback รองรับฟอร์มเวอร์ชันเก่า
  const legacy = formData.get(base);
  if (legacy instanceof File) return legacy.size > 0 ? legacy : null;
  if (typeof legacy === "string") return legacy.length > 0 ? legacy : null;

  return null;
}

/** รวม error ของ Zod ให้อ่านง่ายสั้น ๆ (หยิบอย่างน้อย field แรก ๆ) */
function compactZodErrors(
  errors: Record<string, string[] | undefined>,
  max = 3
): string {
  const parts: string[] = [];
  for (const [field, arr] of Object.entries(errors)) {
    if (arr && arr.length) parts.push(`${field}: ${arr[0]}`);
    if (parts.length >= max) break;
  }
  return parts.join(" | ") || "Validation failed";
}

/** CREATE: ตรวจด้วย Zod → ไม่ redirect (คืนค่า state ให้ client เอาไปเด้ง toast เอง) */
export const createEventWithZod = async (
  formData: FormData
): Promise<EventActionState> => {
  try {
    const data = {
      eventName: formData.get("eventName"),
      eventDate: formData.get("eventDate"),
      location: formData.get("location"),
      details: formData.get("details"),
      capacity: formData.get("capacity"),
      status: formData.get("status"),
      photo: extractPhoto(formData, "photo"),
    };

    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED (CREATE):", fieldErrors);
      return {
        ok: false,
        errors: fieldErrors,
        message: compactZodErrors(fieldErrors),
      };
    }

    const { photo, ...rest } = parsed.data as Record<string, any>;
    const photoLog =
      photo instanceof File
        ? { name: photo.name, size: photo.size, type: photo.type }
        : photo ?? null;

    console.log("CREATE EVENT (VALIDATED, LOG ONLY):", {
      data: rest,
      photo: photoLog,
    });

    // เผื่ออนาคต client อยาก redirect ต่อ: รับ next จากฟอร์มแล้วส่งกลับไป
    const nextVal = formData.get("next");
    const next = typeof nextVal === "string" && nextVal ? nextVal : undefined;

    return { ok: true, message: "Event created!", next };
  } catch (error) {
    console.error("createEventWithZod error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/** UPDATE: validate → ไม่ redirect (คืนค่า state ให้ client เด้ง toast เอง) */
export const updateEventWithZod = async (
  id: string,
  formData: FormData
): Promise<EventActionState> => {
  try {
    const data = {
      eventName: formData.get("eventName"),
      eventDate: formData.get("eventDate"),
      location: formData.get("location"),
      details: formData.get("details"),
      capacity: formData.get("capacity"),
      status: formData.get("status"),
      photo: extractPhoto(formData, "photo"),
    };

    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED (UPDATE):", fieldErrors);
      return {
        ok: false,
        errors: fieldErrors,
        message: compactZodErrors(fieldErrors),
      };
    }

    const { photo, ...rest } = parsed.data as Record<string, any>;
    const photoLog =
      photo instanceof File
        ? { name: photo.name, size: photo.size, type: photo.type }
        : photo ?? null;

    console.log("UPDATE EVENT (LOG ONLY):", {
      id,
      data: rest,
      photo: photoLog,
    });

    const nextVal = formData.get("next");
    const next = typeof nextVal === "string" && nextVal ? nextVal : undefined;

    return { ok: true, message: "Event updated!", next };
  } catch (error) {
    console.error("updateEventWithZod error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/** DELETE: ลบอีเวนต์ → ไม่ redirect (คืนค่า state ให้ client เด้ง toast เอง) */
export const deleteEventById = async (
  id: string
): Promise<EventActionState> => {
  try {
    console.log("DELETE EVENT (LOG ONLY):", { id });
    return { ok: true, message: "Event deleted!" };
  } catch (error) {
    console.error("deleteEventById error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
