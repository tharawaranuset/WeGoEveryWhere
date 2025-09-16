// /components/form/EditEventFormClient.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";

import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { FormInput } from "@/components/form/input/FormInput";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { Calendar28 } from "@/components/form/input/DatePicker";
import {
  updateEventWithZod,
  deleteEventById,
  type EventActionState,
} from "@/actions/actions";
import DeleteButton from "@/components/form/input/deletebutton";
import { useActionToasts } from "../form/useActionToasts";
import { LocationInput } from "../form/input/LocationInput";
import { StatusSelect } from "../form/input/StatusSelect";
import { EventService, UpdateEventDto } from "@/lib/api";

type Existing = {
  photoUrl: string;
  name: string;
  dateString: string;
  location: string;
  details: string;
  capacity: number;
  status: "publish" | "unpublish";
};





export default function EditEventFormClient({
  id,
  existing,
}: {
  id: string;
  existing: Existing;
}) {
  function formDataToUpdateDto(fd: FormData): UpdateEventDto {
  const toNum = (v: FormDataEntryValue | null) =>
    v == null || v === "" ? undefined : Number(v);

  const dateVal = fd.get("eventDate") as string;
  let isoDate: string | undefined = undefined;
  if (dateVal) {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) isoDate = d.toISOString().slice(0, 10);
  }

  return {
    name: fd.get("eventName") as string || undefined,
    cost: toNum(fd.get("cost")),
    date: isoDate,
    time: fd.get("time") as string || undefined,
    place: fd.get("location") as string || undefined,
    capacity: toNum(fd.get("capacity")),
    detail: fd.get("details") as string || undefined,
    rating: toNum(fd.get("rating")),
    userId: 28, // ใส่ hard code หรือจาก session
    status: fd.get("status") as string || undefined,
  };
}


  const updateWrapper = async (
    _prev: { ok: boolean; message?: string },
    formData: FormData
  ): Promise<{ ok: boolean; message?: string }> => {
    try {
      // ✅ ตรวจ id และแปลงเป็น number
      const numericId = typeof id === "number" ? id : parseInt(id, 10);
      if (Number.isNaN(numericId)) {
        console.log({ ok: false, message: "Invalid event id" })
      }

      const dto = formDataToUpdateDto(formData);
      await EventService.eventControllerUpdate(17, dto);

      return { ok: true, message: "Event updated successfully" };
    } catch (err: any) {
      console.error("Update error:", err);
      return { ok: false, message: err?.message ?? "Update failed" };
    }
  };



  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => deleteEventById(id);

  const [updateState, updateFormAction] = useActionState<
    EventActionState,
    FormData
  >(updateWrapper, { ok: false });
  const [deleteState, deleteFormAction] = useActionState<
    EventActionState,
    FormData
  >(deleteWrapper, { ok: false });

  useActionToasts(updateState);
  useActionToasts(deleteState);

  return (
    <div className="relative rounded-[28px] border border-black/50 bg-[var(--color-brand-secondary)] shadow-[0_6px_0_#00000020] z-10">
      {/* UPDATE FORM */}
      <form
        id="updateForm"
        action={updateFormAction}
        className="px-4 pb-2 pt-10 text-sm"
      >
        <div className="mb-4">
          <EventPhotoPicker
            name="photo"
            value={existing.photoUrl}
            linkText="Change your event photo"
            size={208}
            width={280}
            rounded="2xl"
            className="mx-auto"
          />
        </div>

        <FormInput
          name="eventName"
          type="text"
          label="Event name"
          defaultValue={existing.name}
          className="h-10 !bg-[var(--color-brand-background)] rounded-full border-black/30"
        />

        <Calendar28
          name="eventDate"
          label="Event date"
          placeholder="June 01, 2025"
          defaultValue={existing.dateString}
          initialDate={new Date(existing.dateString)}
          required
          className="h-10 !bg-[var(--color-brand-background)] rounded-full border-black/30"
          disableTyping
        />

        <LocationInput defaultValue={existing.location} />

        <TextAreaInput
          name="details"
          label="Details"
          defaultValue={existing.details}
          className="block w-full h-22 overflow-y-auto rounded-[20px] border border-black/30 !bg-[var(--color-brand-background)] resize-none focus:border-black"
        />
      </form>

      {/* FOOTER */}
      <div className="px-4 pb-6">
        {/* Optional line */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[13px] font-semibold text-black/80">
            Optional
          </span>
          <div className="h-px flex-1 bg-black/30" />
        </div>

        {/* Capacity / Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[13px] font-semibold">Capacity</label>
            <input
              form="updateForm"
              name="capacity"
              type="number"
              defaultValue={String(existing.capacity)}
              className="mt-1 h-11 w-full leading-none text-[15px] px-4 rounded-full border border-black/30 !bg-[var(--color-brand-background)] outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:border-neutral-400"
            />
          </div>

          <StatusSelect
            name="status"
            label="Status"
            options={[
              { value: "publish", label: "Publish" },
              { value: "unpublish", label: "Unpublish" },
              // เติมเพิ่มได้ เช่น draft/archived/private/internal ...
            ]}
            defaultValue={existing.status}
            formId="updateForm" // select อยู่ใน footer นอก <form> เลยผูกฟอร์มด้วย
            placeholder="Select…"
          />
        </div>

        {/* Save ใหญ่เต็ม + Delete เล็กขวา */}
        <div className="grid grid-cols-[1fr_auto] gap-3 mt-3 items-center">
          <button
            form="updateForm"
            type="submit"
            className="h-11 w-full rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] hover:bg-[var(--color-brand-greenbutton)] text-black font-medium shadow-[0_2px_0_#00000020]"
          >
            Save
          </button>
          <DeleteButton action={deleteFormAction} />
        </div>
      </div>
    </div>
  );
}
