"use server";
import { eventFormSchema } from "@/utils/schemas";

export type EventActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
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

/** CREATE: ตรวจด้วย Zod แล้ว log (ไม่ redirect) */
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
      // ประกอบ photo จาก photoFile/photoExisting หรือ fallback เป็น field เดิม
      photo: extractPhoto(formData, "photo"),
    };

    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED (CREATE):", fieldErrors);
      return { ok: false, errors: fieldErrors };
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

    return { ok: true, message: "createEvent (validated) logged" };
  } catch (error) {
    console.error("createEventWithZod error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/** UPDATE: validate ด้วย schema เดิม, log-only */
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
      // ใช้ตัวช่วยเดียวกัน
      photo: extractPhoto(formData, "photo"),
    };

    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED (UPDATE):", fieldErrors);
      return { ok: false, errors: fieldErrors };
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

    return { ok: true, message: "updateEvent logged" };
  } catch (error) {
    console.error("updateEventWithZod error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/** ลบอีเวนต์ (log-only) */
export const deleteEventById = async (
  id: string
): Promise<EventActionState> => {
  try {
    console.log("DELETE EVENT (LOG ONLY):", { id });
    return { ok: true, message: "deleteEvent logged" };
  } catch (error) {
    console.error("deleteEventById error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/** เวอร์ชัน log-only ล้วน ๆ สำหรับแก้ไข (ไม่ validate) */
export const updateEventLogOnly = async (
  id: string,
  formData: FormData
): Promise<void> => {
  try {
    const entries = Array.from(formData.entries()).map(([k, v]) => [
      k,
      v instanceof File ? { name: v.name, size: v.size, type: v.type } : v,
    ]);
    console.log("UPDATE EVENT (LOG ONLY, NO VALIDATION):", {
      id,
      data: Object.fromEntries(entries),
    });
  } catch (error) {
    console.error("updateEventLogOnly error:", error);
  }
};
