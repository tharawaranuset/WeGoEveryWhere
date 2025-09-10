import {
  Home,
  CalendarDays,
  PlusCircle,
  MessageSquareMore,
  UserRound,
  LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navLinks: NavLink[] = [
  { href: "/event", label: "Events", icon: CalendarDays },
  { href: "/event/create", label: "Create", icon: PlusCircle },
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquareMore },
  { href: "/profile/edit", label: "Profile", icon: UserRound },
];
