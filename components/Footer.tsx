"use client";

import { useStore } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { levelInfo } from "@/lib/xp";

export default function Footer() {
  const mounted = useMounted();
  const xp = useStore((s) => s.xp);
  const lvl = levelInfo(xp).level;
  return (
    <footer className="statusbar">
      <span className="flex items-center gap-1.5">
        <span className="status-dot bg-easy" /> Piston online
      </span>
      <span className="vsep" />
      <span>Java 21</span>
      <span className="ml-auto flex items-center gap-3">
        <span className="tabular-nums">Lvl {mounted ? lvl : "–"}</span>
        <span className="vsep" />
        <span className="tabular-nums">{mounted ? xp : 0} XP</span>
        <span className="vsep" />
        <span>UTF-8</span>
      </span>
    </footer>
  );
}
