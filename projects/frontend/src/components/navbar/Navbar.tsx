"use client";
import { Navigationlist } from "./Navigationlist";

const Navbar = () => {
  return (
    <>
      <div className="bg-[var(--color-brand-navbar-idle)] py-0 rounded-t-2xl rounded-b-none">
        <Navigationlist />
      </div>
    </>
  );
};
export default Navbar;
