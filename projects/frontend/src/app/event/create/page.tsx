import { createEventWithZod } from "@/actions/actions";
import { SubmitButton } from "@/components/form/Buttons";
import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { Calendar28 } from "@/components/form/input/DatePicker";
import { FormInput } from "@/components/form/input/FormInput";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { Navbar } from "@/components/navbar/Navbar";
import { MapPin, ChevronDown } from "lucide-react";

export default function CreateEventPage() {
  return (
    <div className="min-h-dvh w-full flex flex-col">
      <main className="flex-1 flex justify-center pt-2 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <section className="relative w-[360px] max-w-full pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0">
            <div className="min-w-65 rounded-full border border-black/60 bg-[var(--color-brand-primary)] px-12 py-3 text-center shadow-sm">
              <h1 className="translate-y-[-20%] text-[26px] font-bold tracking-wide">
                Create Event
              </h1>
            </div>
          </div>

          <div className="relative rounded-[28px] border border-black/50 bg-[var(--color-brand-secondary)] shadow-[0_6px_0_#00000020] z-10">
            <form
              action={createEventWithZod}
              className="px-4 pb-6 pt-10 text-sm"
            >
              <div className="mb-4">
                <EventPhotoPicker
                  name="photo"
                  size={208}
                  rounded="2xl"
                  bgClassName="bg-gray-300"
                />
              </div>
              <FormInput
                name="eventName"
                type="text"
                label="Event name"
                className="!bg-[var(--color-brand-background)] rounded-full border-black/30 "
              />
              <Calendar28
                name="eventDate"
                label="Event date"
                placeholder="MM/DD/YYYY"
                required
                className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
                disableTyping
              />
              <div className="mb-3 relative">
                <FormInput
                  name="location"
                  type="text"
                  label="Location"
                  className="!bg-[var(--color-brand-background)] rounded-full border-black/30 pr-10"
                />
                <MapPin className="pointer-events-none absolute right-3 bottom-[10px] h-4 w-4 translate-y-[-2px] text-neutral-600" />
              </div>
              <TextAreaInput
                name="details"
                label="Details"
                className="block w-full h-22 overflow-y-auto rounded-[20px] border border-black/30 !bg-[var(--color-brand-background)] resize-none focus:border-black"
              />

              <div className="mb-3 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-neutral-700">
                  Optional
                </span>
                <div className="h-[1px] flex-1 bg-black/20" />
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <FormInput
                  name="capacity"
                  type="number"
                  label="Capacity"
                  className="!bg-[var(--color-brand-background)] rounded-full border-black/30"
                />

                <div>
                  <label
                    className="mb-1 block text-[13px] font-semibold"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      defaultValue="open"
                      className="w-full appearance-none rounded-full border border-black/30 bg-[var(--color-brand-background)] px-4 py-2 pr-8 outline-none focus-visible:ring-offset-0 focus-visible:ring-1 focus:border-neutral-400"
                    >
                      <option value="publish">Publish</option>
                      <option value="unpublish">Unpublish</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] opacity-0 select-none">
                    Save
                  </label>
                  <SubmitButton
                    text="Save !"
                    size="lg"
                    className="w-full rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] px-6 py-2 font-medium shadow-[0_2px_0_#00000020]"
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
