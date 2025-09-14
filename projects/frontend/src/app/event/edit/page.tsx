import { Navbar } from "@/components/navbar/Navbar";
import EditEventFormClient from "@/components/EditEventFormClient";

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
    status: "publish" as const,
  };

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

          {/* ฟอร์มแบบ client ที่เด้ง toast ได้ แต่ไม่ redirect */}
          <EditEventFormClient id={id} existing={existing} />
        </section>
      </main>

      <div className="inset-x-0 bottom-0 z-[100]">
        <Navbar />
      </div>
    </div>
  );
}
