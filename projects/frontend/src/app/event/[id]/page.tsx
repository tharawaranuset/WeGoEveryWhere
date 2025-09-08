import Image from "next/image";
import { CalendarDays, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EventDetailPage() {
  // ---------- DUMMY DATA ----------
  const event = {
    id: "1",
    title: "Yoga Group",
    joined: 12,
    capacity: 20,
    coverUrl:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1080&auto=format&fit=crop",
    organizer: "YoGa's Garden",
    date: "11/12/2025",
    location: "Lumpini Park",
    details: "Morning yoga session to relax and energize your day.",
  };

  return (
    <div className="min-h-dvh bg-[#FFF1EA]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#FFF1EA] px-4 pt-6 pb-4 shadow">
        <div className="flex items-center gap-3">
          <Link
            href="/event"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD5C6] text-[#EB6223]"
            aria-label="Back"
          >
            <ChevronLeft />
          </Link>
          <div>
            <div className="text-sm text-neutral-500">
              Events / Event Detail
            </div>
            <div className="font-extrabold leading-tight text-[#EB6223]">
              WeGo
              <span className="block -mt-1 text-[#F18A6E]">EveryWhere</span>
            </div>
          </div>
        </div>
      </header>

      {/* Card */}
      <main className="px-4">
        <section className="relative rounded-3xl bg-[#FFEFE3] p-4 shadow">
          {/* title + joined pill */}
          <div className="mb-3 flex items-center justify-between">
            <h1 className="rounded-full bg-white px-5 py-2 text-xl font-bold shadow-sm">
              {event.title}
            </h1>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
              joined {event.joined} / {event.capacity}
            </span>
          </div>

          {/* cover */}
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

          {/* fields */}
          <div className="mt-4 space-y-3">
            <Field label="Organizer">
              <ReadonlyInput value={event.organizer} />
            </Field>

            <Field label="Event date">
              <div className="relative">
                <ReadonlyInput value={event.date} />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
              </div>
            </Field>

            <Field label="Location">
              <div className="relative">
                <ReadonlyInput value={event.location} />
                <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
              </div>
            </Field>

            <Field label="Details">
              <ReadonlyInput value={event.details} />
            </Field>
          </div>

          {/* actions */}
          <div className="mt-5 space-y-2">
            <button className="mx-auto block w-full rounded-full bg-[#9BE28C] px-6 py-2 text-center text-sm font-bold text-green-900 shadow hover:opacity-95">
              Register !
            </button>

            <button className="mx-auto block w-full rounded-full bg-[#F6F6F6] px-6 py-2 text-center text-xs font-medium text-neutral-600 hover:bg-neutral-100">
              Report this activity
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------- small components ----------
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium text-neutral-700">{label}</div>
      {children}
    </div>
  );
}

function ReadonlyInput({
  value,
  placeholder,
}: {
  value?: string;
  placeholder?: string;
}) {
  return (
    <input
      value={value ?? ""}
      placeholder={placeholder}
      readOnly
      className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm outline-none"
    />
  );
}
