"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, Star, Check, Circle, ChevronDown } from "lucide-react";
import { useStore, type Difficulty } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_ORDER,
  allTags,
  getAllExercises,
  getChapters,
} from "@/lib/exercises";

const DIFF_BAR: Record<Difficulty, string> = {
  easy: "border-l-easy",
  medium: "border-l-medium",
  hard: "border-l-hard",
  insane: "border-l-insane",
};
const DIFF_CHIP: Record<Difficulty, string> = {
  easy: "chip-easy",
  medium: "chip-medium",
  hard: "chip-hard",
  insane: "chip-insane",
};

export default function OefeningenPage() {
  const mounted = useMounted();
  const progress = useStore((s) => s.progress);
  const favorites = useStore((s) => s.favorites);

  const [chapterFilter, setChapterFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const chapters = getChapters();
  const tags = allTags();
  const all = getAllExercises();
  const exercises = all.filter((e) => {
    if (chapterFilter !== "all" && e.chapterId !== chapterFilter) return false;
    if (diffFilter !== "all" && e.difficulty !== diffFilter) return false;
    if (tagFilter !== "all" && !e.tags.includes(tagFilter)) return false;
    if (favOnly && !favorites.includes(e.id)) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (
        !e.title.toLowerCase().includes(q) &&
        !e.tags.some((t) => t.includes(q)) &&
        !e.prompt.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const total = all.length;
  const solvedCount = mounted ? all.filter((e) => progress[e.id]?.solved).length : 0;

  return (
    <div className="flex flex-col">
      <div className="toolbar">
        <h1 className="text-[15px] font-semibold">Oefeningen</h1>
        <span className="eyebrow">{mounted ? `${solvedCount}/${total}` : total} opgelost</span>
        <div className="ml-1 hidden w-32 sm:block">
          <div className="meter">
            <i style={{ width: `${total ? Math.round((solvedCount / total) * 100) : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Filterbalk */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="zoek…"
            className="input-search h-8 w-44"
          />
        </div>
        <Select value={chapterFilter} onChange={setChapterFilter}>
          <option value="all">Alle hoofdstukken</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} · {c.title}
            </option>
          ))}
        </Select>
        <Select value={diffFilter} onChange={setDiffFilter}>
          <option value="all">Alle niveaus</option>
          {DIFFICULTY_ORDER.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABEL[d]}
            </option>
          ))}
        </Select>
        <Select value={tagFilter} onChange={setTagFilter}>
          <option value="all">Alle tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </Select>
        <button
          onClick={() => setFavOnly((v) => !v)}
          title="Alleen favorieten"
          className={`btn-secondary h-8 !px-2 ${favOnly ? "!border-accent !text-accent" : ""}`}
        >
          <Star size={14} className={favOnly ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {chapters
          .filter((c) => exercises.some((e) => e.chapterId === c.id))
          .map((c) => {
            const list = exercises.filter((e) => e.chapterId === c.id);
            const cSolved = mounted
              ? all.filter((e) => e.chapterId === c.id && progress[e.id]?.solved).length
              : 0;
            const cTotal = all.filter((e) => e.chapterId === c.id).length;
            return (
              <section key={c.id} className="panel">
                <div className="panel-header">
                  <span>
                    {c.id} · {c.title}
                  </span>
                  <span className="ml-auto tracking-normal text-faint">
                    {cSolved}/{cTotal}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {list.map((e) => {
                    const solved = mounted && progress[e.id]?.solved;
                    const fav = mounted && favorites.includes(e.id);
                    return (
                      <Link
                        key={e.id}
                        href={`/oefeningen/${e.id}`}
                        className={`group flex items-center gap-3 border-l-2 ${DIFF_BAR[e.difficulty]} bg-surface px-3 py-2 hover:bg-surface-2`}
                      >
                        <span className="shrink-0">
                          {solved ? (
                            <Check size={14} className="text-easy" />
                          ) : (
                            <Circle size={12} className="text-faint" />
                          )}
                        </span>
                        <span className="flex-1 truncate text-[13px] font-medium group-hover:text-accent">
                          {e.title}
                        </span>
                        {fav && <Star size={12} className="shrink-0 fill-medium text-medium" />}
                        <span className={`${DIFF_CHIP[e.difficulty]} hidden shrink-0 sm:inline-flex`}>
                          {DIFFICULTY_LABEL[e.difficulty]}
                        </span>
                        <span className="hidden shrink-0 font-mono text-[10px] text-faint md:inline">
                          {e.tags.slice(0, 2).map((t) => `#${t}`).join(" ")}
                        </span>
                        <kbd className="kbd hidden shrink-0 opacity-0 transition-opacity group-hover:opacity-100 lg:inline-flex">
                          ↵
                        </kbd>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        {exercises.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">Geen oefeningen gevonden met deze filters.</p>
        )}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input h-8 w-auto appearance-none pr-7 text-[12px]"
      >
        {children}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-faint" />
    </div>
  );
}
