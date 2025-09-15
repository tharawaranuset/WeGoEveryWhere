"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "../../utils/links";

export const Navigationlist = () => {
  const pathname = usePathname();

  return (
    <div className="font-alt flex justify-center items-stretch w-full">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/event"
            ? pathname.startsWith("/event") &&
              !pathname.startsWith("/event/create")
            : pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 rounded-md transition-colors
              ${
                isActive
                  ? "bg-[var(--color-brand-navbar-active)] text-[var(--color-brand-navbar-text-active)] rounded-t-2xl rounded-b-none py-3 scale-110"
                  : "text-[var(--color-brand-navbar-text-inactive)] hover:bg-[var(--color-brand-navbar-active)] hover:text-[var(--color-brand-navbar-text-active)] rounded-t-2xl rounded-b-none"
              }`}
          >
            <Icon className="w-7 h-7" />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};
