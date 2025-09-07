import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <hr className="mt-2" />
      <nav className="font-alt font-bold flex justify-center between text-2xl">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href={"/event"}>Event</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
