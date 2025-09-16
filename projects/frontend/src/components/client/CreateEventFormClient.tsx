// /components/form/CreateEventFormClient.tsx
"use client";

import * as React from "react";
import { useActionState, useRef } from "react";

import { createEventWithZod, type EventActionState } from "@/actions/actions";
import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { Calendar28 } from "@/components/form/input/DatePicker";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { SubmitButton } from "@/components/form/Buttons";

import { toFields, type EventStateWithFields } from "@/lib/forms";
// ลบ useActionToasts ออก
import { FieldError } from "../form/FieldError";
import { LocationInput } from "../form/input/LocationInput";
import { FormInput } from "../form/input/FormInput";
import { StatusSelect } from "../form/input/StatusSelect";
import { useActionToasts } from "../form/useActionToasts";
import { CreateEventDto, EventService } from "@/lib/api";

export default function CreateEventFormClient() {
  const formRef = useRef<HTMLFormElement>(null);

  const createWrapper = async (
    _prev: EventStateWithFields<EventActionState>,
    formData: FormData
  ): Promise<EventStateWithFields<EventActionState>> => {
    try {
    const dto: CreateEventDto = {
      name: formData.get("eventName") as string,
      date: new Date(formData.get("eventDate") as string).toISOString(),
      time: (formData.get("time") as string) ?? "00:00",
      place: formData.get("location") as string,
      capacity: Number(formData.get("capacity") || 0),
      detail: formData.get("details") as string,
      cost: formData.get("cost") ? Number(formData.get("cost")) : undefined,
      rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
      userId: 28,
    };


    const res = await EventService.eventControllerCreate(dto);
    if (!res) {
      return { ...(res as any), fields: toFields(formData) };
    }

    formRef.current?.reset();
    return { ok: true, fields: toFields(formData) };
  } catch (err: any) {
    console.error(err);
    return { ok: false, errors: err?.fields ?? {}, fields: toFields(formData) };
  }
  };

  const [state, formAction] = useActionState<
    EventStateWithFields<EventActionState>,
    FormData
  >(createWrapper, { ok: false, fields: {} });

  const f = state.fields ?? {};

  // ใน CreateEventFormClient.tsx
  useActionToasts(state?.ok ? state : undefined, {
    successText: "Event created successfully!",
    onSuccess: () => formRef.current?.reset(),
  });
  // ถ้าไม่ ok -> ส่ง undefined เข้า hook -> ไม่ toast

  return (
    <form
      ref={formRef}
      action={formAction}
      className="px-4 pb-6 pt-10 text-sm"
      noValidate
    >
      {/* Photo */}
      <div className="mb-4">
        <EventPhotoPicker
          name="photo"
          size={208}
          rounded="2xl"
          bgClassName="bg-gray-300"
        />
        <FieldError errors={state?.errors?.photo} />
      </div>

      {/* Event name */}
      <FormInput
        name="eventName"
        type="text"
        label="Event name"
        className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
        defaultValue={f.eventName}
      />
      <FieldError errors={state?.errors?.eventName} />

      {/* Event date */}
      <Calendar28
        name="eventDate"
        label="Event date"
        placeholder="Month DD,YYYY"
        required
        className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
        disableTyping
        defaultValue={f.eventDate}
      />
      <FieldError errors={state?.errors?.eventDate} />

      {/* Location */}
      <LocationInput defaultValue={f.location} />
      <FieldError errors={state?.errors?.location} />

      {/* Details */}
      <TextAreaInput
        name="details"
        label="Details"
        className="block w-full h-22 overflow-y-auto rounded-[20px] border border-black/30 !bg-[var(--color-brand-background)] resize-none focus:border-black"
        defaultValue={f.details}
      />
      <FieldError errors={state?.errors?.details} />

      {/* Optional line */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-neutral-700">
          Optional
        </span>
        <div className="h-[1px] flex-1 bg-black/20" />
      </div>

      {/* Capacity / Status */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <FormInput
            name="capacity"
            type="number"
            label="Capacity"
            className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
            defaultValue={f.capacity}
          />
          <FieldError errors={state?.errors?.capacity} />
        </div>

        <div>
          <StatusSelect
            name="status"
            label="Status"
            options={[
              { value: "publish", label: "Publish" },
              { value: "unpublish", label: "Unpublish" },
              // เพิ่มได้ไม่จำกัด
            ]}
            defaultValue={(f.status as string) ?? "publish"}
            placeholder="Select…"
          />
          <FieldError errors={state?.errors?.status} />
        </div>
      </div>

      {/* Save button เต็มแถว */}
      <SubmitButton
        text="Save !"
        size="lg"
        className="w-full rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] px-6 py-3 font-medium shadow-[0_2px_0_#00000020]"
      />
    </form>
  );
}
