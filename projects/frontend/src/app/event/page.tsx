import { Navbar } from "@/components/navbar/Navbar";
import Link from "next/link";

const EventPage = () => {
  return (
    <>
      <div className="flex justify-center mt-4 font-black text-5xl">
        Event Page
      </div>
      <div className="flex justify-center mt-4 font-semibold text-2xl">
        <Link href="/event/edit"> Link to EventEditPage</Link>
      </div>
      <div className="flex justify-center mt-4 font-semibold text-2xl">
        <Link href="/event/create"> Link to EventCreatePage</Link>
      </div>
      <Navbar />
    </>
  );
};
export default EventPage;
