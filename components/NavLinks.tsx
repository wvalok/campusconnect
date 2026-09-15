"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Megaphone,
  Trophy,
  Users,
  MapPin,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/clubs", label: "Societies", icon: Users },
  { href: "/hackathons", label: "Hackathons", icon: Trophy },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/campus", label: "Campus", icon: MapPin },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto text-sm">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition " +
              (active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
