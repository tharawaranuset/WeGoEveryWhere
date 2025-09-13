"use server";

import { redirect } from "next/navigation";
import { eventFormSchema } from "@/utils/schemas";

export type EventActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

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
      photo: formData.get("photo"),
    };

    const parsed = eventFormSchema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED:", fieldErrors);
      return { ok: false, errors: fieldErrors };
    }

    const { photo, ...rest } = parsed.data;

    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      // TODO: upload buffer -> S3/Cloud storage ของคุณ
      // const photoUrl = await uploadToS3(buffer, photo.name, photo.type);
      // แล้วรวม photoUrl เข้า payload บันทึก DB ได้
    }

    // ---- บันทึก DB ด้วย rest + (photoUrl ถ้ามี) ----
    // await db.events.create({ data: { ...rest, photoUrl } });

    redirect("/event");
  } catch (error) {
    console.error("createEventWithZod error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// (ยังเก็บไว้ได้) Log-only เวอร์ชันเดิม — อย่าพยายาม JSON.stringify File ตรง ๆ
export const createEventLogOnly = async (formData: FormData) => {
  try {
    const entries = Array.from(formData.entries()).map(([k, v]) => [
      k,
      v instanceof File ? { name: v.name, size: v.size, type: v.type } : v,
    ]);
    console.log("CREATE EVENT (LOG ONLY):", Object.fromEntries(entries));
  } catch (error) {
    console.error("createEventLogOnly error:", error);
  }
};
