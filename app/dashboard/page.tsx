"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { levelInfo } from "@/lib/xp";
import { evaluateBadges } from "@/lib/badges";
import { getAllExercises } from "@/lib/exercises";

export default function DashboardPage() {
  const mounted = useMounted();
  const displayName = useStore((s) => s.displayName);
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streakCount);
  const longest = useStore((s) => s.longestStreak);
  const progress = useStore((s) => s.progress);
  const recent = useStore((s) => s.recent);

  if (!mounted) {
    return (
      <div className="p-5">
        <div className="h-9 w-40 animate-pulse rounded bg-surface-2" />
      </div>
    );
  }

  const lvl = levelInfo(xp);
  const solved = Object.values(progress).filter((p) => p.solved).length;
  const attempts = Object.values(progress).reduce((a, p) => a + p.attempts, 0);
  const hardSolved = getAllExercises().filter(
    (e) => e.difficulty === "hard" && progress[e.id]?.solved,
  ).length;
  const badges = evaluateBadges({ solved, hardSolved, streak: longest, level: lvl.level });
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="flex flex-col">
      <div className="toolbar">
        <span className="eyebrow">Dashboard</span>
        <span className="vsep" />
        <span className="text-[13px] text-muted">
          Welkom terug, <span className="text-text">{displayName ?? "barista"}</span>
        </span>
        <Link href="/oefeningen" className="btn-primary ml-auto h-8">
          Verder oefenen <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Metrics-strip */}
        <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-md border border-border bg-surface sm:grid-cols-4 sm:divide-y-0">
          <Metric label="Level" value={lvl.level} tone="text-accent">
            <div className="meter mt-2">
              <i style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
            </div>
            <p className="mt-1.5 font-mono text-[11px] tabular-nums text-muted">
              {lvl.intoLevel}/{lvl.neededForNext} XP
            </p>
          </Metric>
          <Metric label="Totale XP" value={xp} tone="text-accent-2" hint="25 XP per oefening" />
          <Metric label="Streak" value={`${streak}d`} tone="text-hard" hint={`piek ${longest}d`} />
          <Metric label="Opgelost" value={solved} tone="text-easy" hint={`${attempts} pogingen`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Badges */}
          <section className="panel lg:col-span-2">
            <div className="panel-header">
              <span>Badges</span>
              <span className="chip ml-auto border-border font-mono tracking-normal">
                <span className="text-accent">{earnedCount}</span>/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
              {badges.map((b) => (
                <div
                  key={b.def.id}
                  className={`flex items-center gap-2.5 rounded-[5px] border px-2.5 py-2 ${
                    b.earned ? "border-accent/30 bg-accent/[0.06]" : "border-border bg-surface-2"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-surface-3 text-base ${
                      b.earned ? "" : "opacity-50 grayscale"
                    }`}
                  >
                    {b.def.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium">{b.def.name}</p>
                    {b.earned ? (
                      <p className="font-mono text-[10px] uppercase tracking-wider text-accent">unlocked</p>
                    ) : (
                      <div className="meter meter-faint mt-1.5">
                        <i style={{ width: `${Math.round(b.progress * 100)}%` }} />
                      </div>
                    )}
                  </div>
                  {!b.earned && (
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-faint">
                      {b.current}/{b.def.target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Recente activiteit */}
          <section className="panel">
            <div className="panel-header">
              <span>Recente activiteit</span>
            </div>
            {recent.length === 0 ? (
              <div className="flex items-center gap-2 px-3 py-4 text-[12px] text-muted">
                <span className="status-dot bg-faint" /> Nog geen runs.
                <Link href="/oefeningen" className="text-accent hover:underline">
                  start een oefening →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recent.slice(0, 8).map((r, i) => (
                  <Link
                    key={i}
                    href={`/oefeningen/${r.exerciseId}`}
                    className="flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-[12px] hover:border-l-accent hover:bg-surface-2"
                  >
                    <span className={`status-dot shrink-0 ${r.passed ? "bg-easy" : "bg-hard"}`} />
                    <span className="flex-1 truncate">{r.title}</span>
                    <span className="font-mono text-[10px] tabular-nums text-faint">{timeAgo(r.at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
  hint,
  children,
}: {
  label: string;
  value: string | number;
  tone?: string;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold leading-none tabular-nums ${tone ?? ""}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 font-mono text-[11px] text-muted">{hint}</p>}
      {children}
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "net";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}u`;
  return `${Math.floor(h / 24)}d`;
}
