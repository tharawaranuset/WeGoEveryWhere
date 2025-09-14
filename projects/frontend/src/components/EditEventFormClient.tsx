"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { MapPin, ChevronDown } from "lucide-react";

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
  // ✅ wrapper ให้ type ตรงกับ useActionState
  const updateWrapper = async (
    _prev: EventActionState,
    formData: FormData
  ): Promise<EventActionState> => {
    return updateEventWithZod(id, formData);
  };

  const deleteWrapper = async (
    _prev: EventActionState,
    _formData: FormData
  ): Promise<EventActionState> => {
    return deleteEventById(id);
  };

  const [updateState, updateFormAction] = useActionState<
    EventActionState,
    FormData
  >(updateWrapper, { ok: false });
  const [deleteState, deleteFormAction] = useActionState<
    EventActionState,
    FormData
  >(deleteWrapper, { ok: false });

  // toast สำหรับ update
  useEffect(() => {
    if (!updateState?.message) return;
    if (updateState.ok) toast.success(updateState.message);
    else toast.error(updateState.message);
  }, [updateState]);

  // toast สำหรับ delete
  useEffect(() => {
    if (!deleteState?.message) return;
    if (deleteState.ok) toast.success(deleteState.message);
    else toast.error(deleteState.message);
  }, [deleteState]);

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

        <div className="mb-3 relative">
          <FormInput
            name="location"
            type="text"
            label="Location"
            defaultValue={existing.location}
            className="h-10 !bg-[var(--color-brand-background)] rounded-full border-black/30 pr-10"
          />
          <MapPin className="pointer-events-none absolute right-3 bottom-[10px] h-4 w-4 -translate-y-0.5 text-neutral-600" />
        </div>

        <TextAreaInput
          name="details"
          label="Details"
          defaultValue={existing.details}
          className="block w-full h-22 overflow-y-auto rounded-[20px] border border-black/30 !bg-[var(--color-brand-background)] resize-none focus:border-black"
        />
      </form>

      {/* FOOTER */}
      <div className="px-4 pb-6">
        <div className="mt-2 mb-1 flex items-center gap-2">
          <span className="text-[13px] font-semibold text-black/80">
            Optional
          </span>
          <div className="h-px flex-1 bg-black/30" />
        </div>

        <div className="grid grid-cols-3 gap-x-3">
          <div>
            <label className="text-[13px] font-semibold ">Capacity</label>
            <input
              form="updateForm"
              name="capacity"
              type="number"
              defaultValue={String(existing.capacity)}
              className="mt-1 h-11 w-full leading-none text-[15px] px-4 rounded-full border border-black/30 !bg-[var(--color-brand-background)] outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:border-neutral-400"
            />
          </div>

          <div className="relative min-w-0">
            <label className="text-[13px] font-semibold" htmlFor="status">
              Status
            </label>
            <select
              form="updateForm"
              id="status"
              name="status"
              defaultValue={existing.status}
              className="mt-1 block w-full h-11 leading-none text-[15px] rounded-full border border-black/30 px-4 pr-8 bg-[var(--color-brand-background)] outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:border-neutral-400 appearance-none"
            >
              <option value="publish">Publish</option>
              <option value="unpublish">Unpublish</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-[42px] h-4 w-4 text-neutral-700" />
          </div>

          <div className="flex items-end justify-end gap-2">
            {/* SAVE button */}
            <button
              form="updateForm"
              type="submit"
              className="h-11 w-4 px-6 rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] hover:bg-[var(--color-brand-greenbutton)] text-black font-medium shadow-[0_2px_0_#00000020]"
            >
              <div className="translate-x-[-17px]">Save</div>
            </button>

            {/* DELETE button: ใช้ DeleteButton เดิม */}
            <DeleteButton action={deleteFormAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
