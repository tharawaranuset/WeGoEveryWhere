// components/navbar/Navbar.tsx
"use client";
import { Navigationlist } from "./Navigationlist";

export const Navbar = () => {
  return (
    <footer className="absolute inset-x-0 bottom-0">
      <div className="pb-[env(safe-area-inset-bottom)]">
        <div className="mx-[10px] h-16 rounded-t-2xl bg-[var(--color-brand-navbar-idle)] shadow-lg">
          <Navigationlist />
        </div>
      </div>
    </footer>
  );
};
