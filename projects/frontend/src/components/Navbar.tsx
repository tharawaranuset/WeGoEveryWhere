import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between text-2xl">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href={"/event"}>Event</Link>
        </div>

        <div className="flex gap-4">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
      <hr className="mb-4" />
    </>
  );
};
export default Navbar;
