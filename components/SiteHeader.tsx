"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import NavTabs from "./NavTabs";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { openCommandPalette } from "@/lib/commandPalette";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-surface">
      <div className="flex h-10 items-center gap-2 px-3">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 font-mono text-[12.5px] tracking-tight"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-accent text-[11px] font-bold text-on-accent">
            J
          </span>
          <span>
            java<span className="text-muted">·</span>
            <span className="text-muted">trainer</span>
          </span>
          <span className="kbd ml-1 hidden lg:inline-flex">v0.1</span>
        </Link>

        <div className="vsep" />

        {/* Mobiel: nav-tabs in de header. Desktop: de activity rail links is primair. */}
        <div className="min-w-0 flex-1 overflow-x-auto sm:hidden">
          <NavTabs />
        </div>
        <div className="hidden flex-1 sm:block" />

        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-2 py-1 text-[11px] text-faint transition-colors hover:border-border-strong hover:text-muted md:flex"
        >
          <Search size={13} />
          <span>Snel zoeken</span>
          <kbd className="kbd">⌘K</kbd>
        </button>

        <div className="vsep hidden md:block" />

        <div className="flex shrink-0 items-center gap-0.5">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
