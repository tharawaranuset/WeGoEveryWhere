"use client";

import { SubmitButton } from "@/components/form/Buttons";
import Image from "next/image";
import { createEventLogOnly, createEventWithZod } from "@/actions/actions";
import { InputField } from "@/components/form/InputField";

const eventAction = createEventLogOnly;
// const eventAction = createEventWithZod;

const CreateEventPage = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-[#FFF8F0] rounded-2xl shadow">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/next.svg"
          alt="Next.js Logo"
          width={340}
          height={100}
          priority
        />
      </div>

      <h1 className="flex justify-center text-2xl font-bold mb-6">
        Create Your Event
      </h1>

      <div className="fonts-sans font-bold">
        <form className="fonts-sans  space-y-4" action={eventAction}>
          <InputField
            name="eventName"
            type="text"
            label="Event Name"
            placeholder="Enter event name"
          />
          <InputField name="eventDate" type="date" label="Event Date" />
          <InputField
            name="location"
            type="text"
            label="Location"
            placeholder="Enter location"
          />
          <InputField
            name="details"
            type="text"
            label="Details"
            placeholder="Enter details"
          />

          <div>
            <h2 className="text-sm font-semibold mb-2">Optional</h2>
            <InputField
              name="capacity"
              type="number"
              label="Capacity"
              placeholder="Max people"
            />
            <InputField
              name="status"
              type="text"
              label="Status"
              placeholder="Active / Inactive"
            />
          </div>

          <div className="flex justify-center pt-2">
            <SubmitButton type="submit" text="Create Event" size="lg" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
