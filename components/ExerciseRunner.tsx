"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Star, Check, Lock, ChevronRight, FlaskConical } from "lucide-react";
import JavaIde, { type JavaIdeHandle } from "./JavaIde";
import Prose from "./Prose";
import XpToast from "./XpToast";
import { useStore, type ProjectFile, type Difficulty } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { gradeExercise, type GradeResult } from "@/lib/javaGrader";
import { syncLeaderboard } from "@/lib/leaderboardSync";
import {
  DIFFICULTY_LABEL,
  getAllExercises,
  getChapter,
  type Exercise,
} from "@/lib/exercises";

const DIFF_CHIP: Record<Difficulty, string> = {
  easy: "chip-easy",
  medium: "chip-medium",
  hard: "chip-hard",
  insane: "chip-insane",
};

export default function ExerciseRunner({ exercise }: { exercise: Exercise }) {
  const mounted = useMounted();
  const ideRef = useRef<JavaIdeHandle>(null);
  const toastCounter = useRef(0);

  const [grading, setGrading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [lastGrade, setLastGrade] = useState<GradeResult | null>(null);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; amount: number } | null>(null);

  const favorite = useStore((s) => s.favorites.includes(exercise.id));
  const progress = useStore((s) => s.progress[exercise.id]);
  const note = useStore((s) => s.notes[exercise.id] ?? "");
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const setNote = useStore((s) => s.setNote);

  const attempts = progress?.attempts ?? 0;
  const solved = progress?.solved ?? false;
  const canSeeSolution = attempts >= 3 && !!exercise.solutionFiles?.length;

  const chapter = getChapter(exercise.chapterId);
  const all = getAllExercises();
  const idx = all.findIndex((e) => e.id === exercise.id);
  const next = idx >= 0 ? all[idx + 1] : undefined;

  const initialFiles: ProjectFile[] = exercise.starterFiles.map((f) => ({
    path: f.name,
    content: f.content,
  }));

  async function grade() {
    if (grading || testing) return;
    const files = ideRef.current?.getFiles() ?? [];
    const execFiles = files.map((f) => ({ name: f.path, content: f.content }));
    setGrading(true);
    ideRef.current?.showResult(null, null, true);
    const result = await gradeExercise(exercise, execFiles);
    const outcome = useStore
      .getState()
      .submitResult(exercise.id, result.passed, {
        title: exercise.title,
        difficulty: exercise.difficulty,
      });
    setGrading(false);
    setLastGrade(result);
    ideRef.current?.showResult(
      result.exec ?? null,
      <TestReport result={result} />,
      false,
    );
    if (result.passed && outcome.firstSolve) {
      toastCounter.current += 1;
      setToast({ id: toastCounter.current, amount: outcome.awardedXp });
    }
    if (result.passed) syncLeaderboard();
  }

  // Test-knop: draait de verborgen tests en toont per check OK/FOUT in de
  // console, MAAR verbetert niet (geen XP, geen poging, geen leaderboard).
  async function test() {
    if (grading || testing) return;
    const files = ideRef.current?.getFiles() ?? [];
    const execFiles = files.map((f) => ({ name: f.path, content: f.content }));
    setTesting(true);
    ideRef.current?.showResult(null, null, true);
    const result = await gradeExercise(exercise, execFiles);
    setTesting(false);
    ideRef.current?.showResult(result.exec ?? null, <TestReport result={result} />, false);
  }

  return (
    <div className="mx-auto flex max-w-[120rem] animate-fade-in flex-col gap-3 px-3 py-3 lg:h-full">
      {toast && toast.amount > 0 && (
        <XpToast key={toast.id} amount={toast.amount} />
      )}

      <header className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
        <Link href="/oefeningen" className="font-mono text-[12px] text-muted hover:text-accent">
          oefeningen
        </Link>
        <ChevronRight size={13} className="text-faint" />
        {chapter && <span className="font-mono text-[12px] text-faint">{chapter.id}</span>}
        {chapter && <ChevronRight size={13} className="text-faint" />}
        <span className="truncate font-mono text-[12px] text-text">{exercise.title}</span>
        <span className={`${DIFF_CHIP[exercise.difficulty]} ml-1`}>
          {DIFFICULTY_LABEL[exercise.difficulty]}
          {exercise.difficulty === "insane" && " · 0 XP"}
        </span>
        {mounted && solved && (
          <span className="chip-easy">
            <Check size={11} /> opgelost
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(exercise.id)}
            className="btn-ghost h-7 w-7 !px-0"
            title={favorite ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
          >
            <Star size={14} className={mounted && favorite ? "fill-medium text-medium" : ""} />
          </button>
          {next && (
            <Link href={`/oefeningen/${next.id}`} className="btn-secondary h-7 !py-0 text-xs">
              Volgende <ChevronRight size={13} />
            </Link>
          )}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(300px,380px)_1fr]">
        {/* Opgave-paneel */}
        <aside className="panel flex flex-col lg:min-h-0">
          <div className="panel-header">
            <span>Opgave</span>
            <span className="ml-auto tracking-normal text-faint">{exercise.id}</span>
          </div>
          <div className="min-h-0 max-h-[45vh] flex-1 overflow-y-auto p-3 lg:max-h-none">
            {lastGrade && <Verdict result={lastGrade} />}
            <Prose text={exercise.prompt} />
            {exercise.example && (
              <div className="mt-3 overflow-hidden rounded-md border border-border">
                <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-2 py-1">
                  <span className="status-dot bg-border-strong" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint">voorbeeld · stdout</span>
                </div>
                <pre className="overflow-x-auto bg-bg p-3 font-mono text-xs">{exercise.example}</pre>
              </div>
            )}
            {exercise.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-faint">
                {exercise.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <NoteBox value={mounted ? note : ""} onChange={(v) => setNote(exercise.id, v)} />
          </div>
        </aside>

        {/* IDE */}
        <div className="h-[78vh] min-h-0 lg:h-auto">
          <JavaIde
            ref={ideRef}
            projectId={`ex:${exercise.id}`}
            initialFiles={initialFiles}
            extraActions={
              <>
                <button
                  onClick={test}
                  disabled={grading || testing}
                  className="btn-secondary h-7 !py-0 text-xs"
                  title="Draai de tests zonder te verbeteren — toont per check juist/fout, geen XP"
                >
                  <FlaskConical size={13} className="text-accent-2" /> {testing ? "Bezig…" : "Test"}
                </button>
                <button
                  onClick={grade}
                  disabled={grading || testing}
                  className="btn-secondary h-7 !py-0 text-xs"
                >
                  <Check size={13} className="text-easy" /> {grading ? "Bezig…" : "Verbeteren"}
                </button>
                <button
                  onClick={() => setSolutionOpen(true)}
                  disabled={!canSeeSolution}
                  title={
                    canSeeSolution
                      ? "Toon de modeloplossing"
                      : `Beschikbaar na 3 pogingen (${Math.min(attempts, 3)}/3)`
                  }
                  className="btn-ghost h-7 !py-0 text-xs"
                >
                  <Lock size={13} /> Oplossing
                  {!canSeeSolution && (
                    <span className="ml-0.5 font-mono text-[10px] tabular-nums text-faint">
                      {Math.min(attempts, 3)}/3
                    </span>
                  )}
                </button>
              </>
            }
          />
        </div>
      </div>

      {solutionOpen && exercise.solutionFiles && (
        <SolutionModal
          files={exercise.solutionFiles}
          onClose={() => setSolutionOpen(false)}
        />
      )}
    </div>
  );
}

function Verdict({ result }: { result: GradeResult }) {
  const ok = result.passed;
  return (
    <div
      className={`mb-4 rounded-md border p-3 text-sm ${
        ok ? "border-easy/40 bg-easy/10 text-easy" : "border-hard/40 bg-hard/10 text-hard"
      }`}
    >
      <p className="flex items-center gap-2 font-medium">
        <span className={`status-dot ${ok ? "bg-easy" : "bg-hard"}`} />
        <span className="font-mono text-[11px] uppercase tracking-wider">{ok ? "passed" : "failed"}</span>
        <span className="font-sans text-text/90">{result.message}</span>
      </p>
      {result.staticFailures && result.staticFailures.length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-text">
          {result.staticFailures.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
      {result.testLines && result.testLines.length > 0 && (
        <p className="mt-1 text-text">
          {result.testLines.filter((l) => l.ok).length}/{result.testLines.length} checks geslaagd —
          zie het Test-tabblad onderaan.
        </p>
      )}
    </div>
  );
}

function TestReport({ result }: { result: GradeResult }) {
  if (result.staticFailures?.length) {
    return (
      <div>
        <p className="mb-1 text-hard">Structuurcheck faalde:</p>
        <ul className="list-disc pl-5 text-hard">
          {result.staticFailures.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (result.expected != null) {
    return (
      <div className="space-y-2">
        <div>
          <p className="text-muted">Verwacht:</p>
          <pre className="whitespace-pre-wrap text-easy">{result.expected}</pre>
        </div>
        <div>
          <p className="text-muted">Gekregen:</p>
          <pre className="whitespace-pre-wrap text-text">{result.got}</pre>
        </div>
      </div>
    );
  }
  if (result.testLines?.length) {
    return (
      <div className="space-y-0.5">
        {result.testLines.map((l, i) => (
          <div key={i} className={l.ok ? "text-easy" : "text-hard"}>
            {l.ok ? "✓" : "✗"} {l.name}
          </div>
        ))}
      </div>
    );
  }
  return <p className="text-muted">{result.message}</p>;
}

function NoteBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-muted hover:text-accent"
      >
        📝 Notitie {value ? "(opgeslagen)" : ""} {open ? "▾" : "▸"}
      </button>
      {open && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Je persoonlijke notitie bij deze oefening…"
          className="input mt-2 h-24 resize-none"
        />
      )}
    </div>
  );
}

function SolutionModal({
  files,
  onClose,
}: {
  files: { name: string; content: string }[];
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-border-strong bg-surface shadow-panel"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="eyebrow text-[12px] normal-case tracking-normal text-text">Modeloplossing</h2>
          <button onClick={onClose} className="btn-ghost h-8 !px-2">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {files.map((f) => (
            <div key={f.name}>
              <p className="mb-1 font-mono text-xs text-accent">{f.name}</p>
              <pre className="overflow-x-auto rounded-md border bg-surface-2 p-3 font-mono text-xs leading-relaxed">
                {f.content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
