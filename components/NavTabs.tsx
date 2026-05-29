"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/oefeningen", label: "Oefeningen" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/theorie", label: "Theorie" },
  { href: "/examen", label: "Examen" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function NavTabs() {
  const path = usePathname() ?? "";
  return (
    <nav className="flex h-10 items-stretch whitespace-nowrap">
      {TABS.map((t) => {
        const active = path === t.href || path.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${active ? "tab-active font-medium" : "tab-inactive"}`}
          >
            {active && <span className="tab-accent" />}
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
