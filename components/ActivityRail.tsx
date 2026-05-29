"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Terminal,
  BookOpen,
  GraduationCap,
  Trophy,
} from "lucide-react";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oefeningen", label: "Oefeningen", icon: ListChecks },
  { href: "/sandbox", label: "Sandbox", icon: Terminal },
  { href: "/theorie", label: "Theorie", icon: BookOpen },
  { href: "/examen", label: "Examen", icon: GraduationCap },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function ActivityRail() {
  const path = usePathname() ?? "";
  return (
    // De wrapper reserveert vast 48px in de layout. De échte rail staat absoluut
    // en klapt eroverheen open (overlay) → de content schuift niet mee, dus de
    // animatie blijft vloeiend (geen Monaco-relayout).
    <div className="relative hidden w-12 shrink-0 sm:block">
      <nav
        aria-label="Hoofdnavigatie"
        className="group absolute inset-y-0 left-0 z-30 flex w-12 flex-col gap-1 overflow-hidden border-r border-border bg-surface py-2 shadow-none transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-56 hover:shadow-panel focus-within:w-56 focus-within:shadow-panel"
      >
        {ITEMS.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-9 items-center transition-colors ${
                active
                  ? "text-accent"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              {/* actieve indicator */}
              <span
                className={`absolute inset-y-1.5 left-0 w-0.5 rounded-r bg-accent transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* vaste 48px icoon-slot → icoon verspringt niet bij het openklappen */}
              <span className="grid h-9 w-12 shrink-0 place-items-center">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="-translate-x-1 whitespace-nowrap pr-4 text-sm font-medium opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-100 group-focus-within:translate-x-0 group-focus-within:opacity-100">
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
