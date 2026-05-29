"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import JavaIde, { type JavaIdeHandle } from "@/components/JavaIde";
import Prose from "@/components/Prose";
import { useStore, type ProjectFile, type Difficulty } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { gradeExercise, type GradeResult } from "@/lib/javaGrader";
import {
  DIFFICULTY_LABEL,
  getAllExercises,
  type Exercise,
} from "@/lib/exercises";

type Phase = "idle" | "running" | "done";

const DIFF_CLASS: Record<Difficulty, string> = {
  easy: "border-easy/40 text-easy",
  medium: "border-medium/50 text-medium",
  hard: "border-hard/50 text-hard",
  insane: "border-insane/50 text-insane",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamenPage() {
  const mounted = useMounted();
  const [phase, setPhase] = useState<Phase>("idle");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  const [count, setCount] = useState(3);
  const [minutes, setMinutes] = useState(30);

  const total = getAllExercises().length;

  useEffect(() => {
    if (phase !== "running") return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && endTime && now >= endTime) setPhase("done");
  }, [now, endTime, phase]);

  function start() {
    const chosen = shuffle(getAllExercises()).slice(0, count);
    chosen.forEach((e) => useStore.getState().resetProject(`exam:${e.id}`));
    setExercises(chosen);
    setResults({});
    setCurrent(0);
    setEndTime(minutes > 0 ? Date.now() + minutes * 60_000 : null);
    setPhase("running");
  }

  if (!mounted) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted">Laden…</div>;
  }

  if (phase === "idle") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Examensimulatie</h1>
        <p className="mt-2 text-muted">
          Je krijgt willekeurige oefeningen onder tijdsdruk. Geen XP — puur oefenen voor het echte werk.
          Achteraf zie je je score en de modeloplossingen.
        </p>
        <div className="card mt-6 space-y-5 p-6">
          <div>
            <p className="mb-2 text-sm font-medium">Aantal oefeningen</p>
            <div className="flex gap-2">
              {[3, 5, Math.min(8, total)].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`btn h-9 border ${count === n ? "border-accent text-accent" : "text-muted"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tijdslimiet</p>
            <div className="flex gap-2">
              {[
                { v: 0, l: "Geen" },
                { v: 15, l: "15 min" },
                { v: 30, l: "30 min" },
                { v: 60, l: "60 min" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setMinutes(o.v)}
                  className={`btn h-9 border ${minutes === o.v ? "border-accent text-accent" : "text-muted"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <button onClick={start} className="btn-primary w-full">
            Start examen
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const passed = exercises.filter((e) => results[e.id]).length;
    return (
      <ExamResults
        exercises={exercises}
        results={results}
        passed={passed}
        onRetry={() => setPhase("idle")}
      />
    );
  }

  // running
  const exercise = exercises[current];
  const remaining = endTime ? Math.max(0, endTime - now) : null;
  const mm = remaining != null ? Math.floor(remaining / 60000) : 0;
  const ss = remaining != null ? Math.floor((remaining % 60000) / 1000) : 0;
  const lowTime = remaining != null && remaining < 60_000;

  return (
    <div className="mx-auto flex max-w-[120rem] flex-col gap-3 px-3 py-3 lg:h-full">
      <header className="flex flex-wrap items-center gap-3">
        <span className="font-medium">
          Vraag {current + 1} / {exercises.length}
        </span>
        <span className="flex gap-1">
          {exercises.map((e, i) => (
            <span
              key={e.id}
              className={`h-2 w-4 rounded-[2px] ${
                results[e.id] === true
                  ? "bg-easy"
                  : results[e.id] === false
                    ? "bg-hard"
                    : i === current
                      ? "bg-accent"
                      : "bg-surface-3"
              }`}
            />
          ))}
        </span>
        {remaining != null && (
          <span className={`chip font-mono tabular-nums ${lowTime ? "border-hard/50 text-hard" : "border-border text-muted"}`}>
            <span className={`status-dot ${lowTime ? "animate-pulse bg-hard" : "bg-easy"}`} />
            {mm}:{String(ss).padStart(2, "0")}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="btn-ghost h-8 text-sm"
          >
            ← Vorige
          </button>
          {current < exercises.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} className="btn-secondary h-8 text-sm">
              Volgende →
            </button>
          ) : (
            <button onClick={() => setPhase("done")} className="btn-primary h-8 text-sm">
              Examen indienen
            </button>
          )}
        </div>
      </header>

      <ExamExercise
        key={exercise.id}
        exercise={exercise}
        verdict={results[exercise.id]}
        onResult={(passed) => setResults((r) => ({ ...r, [exercise.id]: passed }))}
      />
    </div>
  );
}

function ExamExercise({
  exercise,
  verdict,
  onResult,
}: {
  exercise: Exercise;
  verdict: boolean | undefined;
  onResult: (passed: boolean) => void;
}) {
  const ideRef = useRef<JavaIdeHandle>(null);
  const [grading, setGrading] = useState(false);
  const [last, setLast] = useState<GradeResult | null>(null);

  const initialFiles: ProjectFile[] = useMemo(
    () => exercise.starterFiles.map((f) => ({ path: f.name, content: f.content })),
    [exercise],
  );

  async function check() {
    if (grading) return;
    const files = ideRef.current?.getFiles() ?? [];
    setGrading(true);
    ideRef.current?.showResult(null, null, true);
    const result = await gradeExercise(
      exercise,
      files.map((f) => ({ name: f.path, content: f.content })),
    );
    setGrading(false);
    setLast(result);
    onResult(result.passed);
    ideRef.current?.showResult(result.exec ?? null, null, false);
  }

  return (
    <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(300px,360px)_1fr]">
      <aside className="card flex flex-col overflow-hidden lg:min-h-0">
        <div className="min-h-0 max-h-[40vh] flex-1 overflow-y-auto p-4 lg:max-h-none">
          <div className="mb-2 flex items-center gap-2">
            <span className={`chip ${DIFF_CLASS[exercise.difficulty]}`}>
              {DIFFICULTY_LABEL[exercise.difficulty]}
            </span>
            <h2 className="font-semibold">{exercise.title}</h2>
          </div>
          {verdict !== undefined && (
            <p className={`mb-2 text-sm font-medium ${verdict ? "text-easy" : "text-hard"}`}>
              {verdict ? "✓ Correct" : "✗ Nog niet juist"}
              {last?.message ? ` — ${last.message}` : ""}
            </p>
          )}
          <Prose text={exercise.prompt} />
        </div>
      </aside>

      <div className="h-[70vh] min-h-0 lg:h-auto">
        <JavaIde
          ref={ideRef}
          projectId={`exam:${exercise.id}`}
          initialFiles={initialFiles}
          extraActions={
            <button onClick={check} disabled={grading} className="btn-secondary h-8 !py-0 text-xs">
              {grading ? "Controleren…" : "✓ Controleer"}
            </button>
          }
        />
      </div>
    </div>
  );
}

function ExamResults({
  exercises,
  results,
  passed,
  onRetry,
}: {
  exercises: Exercise[];
  results: Record<string, boolean>;
  passed: number;
  onRetry: () => void;
}) {
  const [solution, setSolution] = useState<Exercise | null>(null);
  const pct = Math.round((passed / exercises.length) * 100);
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Examen afgelopen</h1>
      <div className="card mt-6 p-6 text-center">
        <p className="text-sm text-muted">Score</p>
        <p className="font-mono text-4xl font-semibold tabular-nums text-accent">
          {passed} / {exercises.length}
        </p>
        <p className="mt-1 text-muted">{pct}% correct</p>
      </div>

      <div className="card mt-4 divide-y">
        {exercises.map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
            <span className={`status-dot shrink-0 ${results[e.id] ? "bg-easy" : "bg-hard"}`} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
              {results[e.id] ? "pass" : "fail"}
            </span>
            <span className="flex-1 truncate">{e.title}</span>
            {e.solutionFiles?.length ? (
              <button onClick={() => setSolution(e)} className="btn-ghost h-7 !py-0 text-xs">
                Modeloplossing
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={onRetry} className="btn-primary">
          Opnieuw
        </button>
        <Link href="/oefeningen" className="btn-secondary">
          Naar oefeningen
        </Link>
      </div>

      {solution && solution.solutionFiles && (
        <div
          onClick={() => setSolution(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-border-strong bg-surface shadow-panel"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="eyebrow text-[12px] normal-case tracking-normal text-text">{solution.title}</h2>
              <button onClick={() => setSolution(null)} className="btn-ghost h-8 !px-2">
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {solution.solutionFiles.map((f) => (
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
      )}
    </div>
  );
}
