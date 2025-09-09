"use client";
import Image from "next/image";
import { CalendarDays, MapPin, ChevronLeft } from "lucide-react";
import { SubmitButton } from "@/components/form/Buttons";
import { InputField } from "@/components/form/InputField";
import { TextAreaField } from "@/components/form/TextAreaField";

const event = {
  id: "0",
  title: "Yoga Group",
  joined: 15,
  capacity: 19,
  coverUrl:
    "https://images.unsplash.com/photo-1540206395-68808572332f?q=80&w=1600&auto=format&fit=crop",
  organizer: "YoGa's Garden",
  date: "10/12/2025",
  location: "Lumpini Park",
  details: "Morning yoga session to relax and energize your day.",
};

export default function EventDetailPage() {
  return (
    <>
      <div className="font-alt min-h-dvh bg-[#FFF1EA]">
        <main className="px-4">
          <section className="relative rounded-3xl bg-[#FFEFE3] p-4 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h1 className="rounded-full bg-white px-5 py-2 text-xl font-bold shadow-sm">
                {event.title}
              </h1>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                joined {event.joined} / {event.capacity}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <Image
                src={event.coverUrl}
                alt={event.title}
                width={900}
                height={600}
                className="h-48 w-full object-cover"
                priority
              />
            </div>
            <div className="mt-4 space-y-3">
              <InputField
                name="organizer"
                label="Organizer"
                type="text"
                readonly={true}
                classname="bg-gray-100 border border-gray-300 text-sm text-gray-700"
                defaultValue={event.organizer}
              />
              <div className="relative">
                <InputField
                  name="date"
                  type="text"
                  label="Date"
                  readonly={true}
                  classname="bg-gray-100 border border-gray-300 text-sm text-gray-700"
                  defaultValue={event.date}
                />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 opacity-60" />
              </div>
              <div className="relative">
                <InputField
                  name="location"
                  type="text"
                  label="Location"
                  readonly={true}
                  classname="bg-gray-100 border border-gray-300 text-sm text-gray-700"
                  defaultValue={event.location}
                />
                <MapPin className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 opacity-60" />
              </div>
              <TextAreaField
                name="details"
                label="Details"
                defaultValue={
                  event.details.length > 250
                    ? event.details.substring(0, 250) + "..."
                    : event.details
                }
                readonly={true}
                rows={5}
                classname="bg-gray-100 border border-gray-300 text-sm text-gray-700 resize-none "
              />
            </div>

            <div className="mt-5 space-y-2">
              <SubmitButton
                type="button"
                onclick={() => console.log("Register to this activity")}
                className="mx-auto block w-full rounded-full bg-[#9BE28C] px-6 py-2 text-center text-sm font-bold text-green-900 shadow hover:opacity-95"
                text="Register !"
              />
              <SubmitButton
                type="button"
                onclick={() => console.log("Report this activity")}
                className="mx-auto block w-full rounded-full bg-[#F6F6F6] px-6 py-2 text-center text-xs font-medium text-neutral-600 hover:bg-neutral-100 "
                text="Report this activity"
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
