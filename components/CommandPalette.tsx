"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  ListChecks,
  Terminal,
  BookOpen,
  GraduationCap,
  Trophy,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { PALETTE_EVENT } from "@/lib/commandPalette";
import { getStoredTheme, setStoredTheme } from "@/lib/theme";

interface Action {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  run: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(
    () => [
      { id: "dashboard", label: "Ga naar Dashboard", icon: LayoutDashboard, run: () => router.push("/dashboard") },
      { id: "oefeningen", label: "Bekijk oefeningen", icon: ListChecks, run: () => router.push("/oefeningen") },
      { id: "sandbox", label: "Open de sandbox", icon: Terminal, run: () => router.push("/sandbox") },
      { id: "theorie", label: "Ga naar Theorie", icon: BookOpen, run: () => router.push("/theorie") },
      { id: "examen", label: "Start examensimulatie", icon: GraduationCap, run: () => router.push("/examen") },
      { id: "leaderboard", label: "Open het leaderboard", icon: Trophy, run: () => router.push("/leaderboard") },
      { id: "theme", label: "Wissel thema (licht / donker)", icon: Moon, run: () => setStoredTheme(getStoredTheme() === "dark" ? "light" : "dark") },
    ],
    [router],
  );

  const filtered = query
    ? actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : actions;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  function exec(a: Action) {
    setOpen(false);
    a.run();
  }

  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[16vh] backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel w-full max-w-[560px] animate-fade-in shadow-panel"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[active]) exec(filtered[active]);
          }
        }}
      >
        <div className="relative border-b border-border">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Typ een commando of zoek…"
            className="w-full bg-transparent py-3 pl-9 pr-3 font-mono text-[13px] text-text placeholder:text-faint focus:outline-none"
          />
        </div>
        <div className="max-h-[320px] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-[13px] text-muted">Geen resultaten.</p>
          )}
          {filtered.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => exec(a)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] ${
                  i === active ? "bg-surface-3 text-text" : "text-muted"
                }`}
              >
                <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                <span className="flex-1">{a.label}</span>
                {a.hint && <kbd className="kbd">{a.hint}</kbd>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 border-t border-border bg-surface-2 px-3 py-1.5 font-mono text-[10px] text-faint">
          <span className="flex items-center gap-1"><kbd className="kbd">↑↓</kbd> navigeer</span>
          <span className="flex items-center gap-1"><kbd className="kbd">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="kbd">esc</kbd> sluit</span>
        </div>
      </div>
    </div>
  );
}
