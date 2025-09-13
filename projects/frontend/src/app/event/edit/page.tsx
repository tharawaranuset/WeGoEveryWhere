import { MapPin, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import EventPhotoPicker from "@/components/form/EventPhotoPicker";
import { FormInput } from "@/components/form/input/FormInput";
import { TextAreaInput } from "@/components/form/input/TextAreaInout";
import { Calendar28 } from "@/components/form/input/DatePicker";
import { updateEventWithZod, deleteEventById } from "@/actions/actions";
import DeleteButton from "@/components/deletebutton";

export default function EditEventPage() {
  const id = "evt_123";
  const existing = {
    photoUrl:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop",
    name: "YoGa's Garden",
    dateString: "11/12/2025",
    location: "Lumpini Park",
    details:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae at tenetur sed odio eaque culpa rerum laboriosam beatae voluptate sint doloribus nisi tempore nihil ipsa mollitia pariatur expedita, quisquam consequuntur debitis hic optio voluptates? Facere, commodi porro ad consequatur eum tenetur nostrum voluptas doloribus omnis rem tempora assumenda itaque, aliquid quas! Quia tempora mollitia libero, quasi iusto culpa, ad illo expedita repellat architecto numquam quaerat dolorem maxime error cupiditate placeat dicta incidunt deleniti? Nam quia voluptatem, aspernatur debitis, nobis unde officiis cum soluta accusamus veniam assumenda modi. Mollitia aliquid, blanditiis asperiores animi quia quis, eveniet fugit cupiditate, aperiam ipsa excepturi! ",
    capacity: 150,
    status: "open" as const,
  };
  const updateAction = updateEventWithZod.bind(null, id);
  const deleteAction = deleteEventById.bind(null, id);

  return (
    <div className="min-h-dvh w-full flex flex-col">
      <main className="flex-1 flex justify-center pt-2 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <section className="relative w-[360px] max-w-full pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0">
            <div className="min-w-65 rounded-full border border-black/60 bg-[var(--color-brand-primary)] px-12 py-3 text-center shadow-sm">
              <h1 className="translate-y-[-20%] text-[26px] font-bold tracking-wide">
                Edit Event
              </h1>
            </div>
          </div>

          <div className="relative rounded-[28px] border border-black/50 bg-[var(--color-brand-secondary)] shadow-[0_6px_0_#00000020] z-10">
            <form
              id="updateForm"
              action={updateAction}
              className="px-4 pb-2 pt-10 text-sm"
              encType="multipart/form-data"
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
                    className="mt-1 h-11 w-full leading-none text-[15px] px-4
                      rounded-full border border-black/30
                      !bg-[var(--color-brand-background)]
                      outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:border-neutral-400"
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
                    <option value="open">Open</option>
                    <option value="full">Full</option>
                    <option value="closed">Closed</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-[42px] h-4 w-4 text-neutral-700" />
                </div>
                <div className="flex items-end justify-end gap-2">
                  <button
                    form="updateForm"
                    type="submit"
                    className="h-11 w-4 px-6 rounded-full border border-black/40 bg-[var(--color-brand-greenbutton)] hover:bg-[var(--color-brand-greenbutton)] text-black font-medium shadow-[0_2px_0_#00000020]"
                  >
                    <div className="translate-x-[-17px]">Save</div>
                  </button>
                  <DeleteButton action={deleteAction} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
