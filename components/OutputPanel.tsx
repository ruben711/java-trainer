"use client";

import { useState, type ReactNode } from "react";
import type { ExecResult } from "@/lib/types";

type Tab = "console" | "compile" | "test";

interface OutputPanelProps {
  result: ExecResult | null;
  loading: boolean;
  entryPath?: string | null;
  knownFiles?: string[];
  onJump?: (path: string, line: number) => void;
  testSlot?: ReactNode;
}

const LINE_RE = /([A-Za-z0-9_./-]+\.java):(\d+)/g;

export default function OutputPanel({
  result,
  loading,
  entryPath,
  knownFiles = [],
  onJump,
  testSlot,
}: OutputPanelProps) {
  const [tab, setTab] = useState<Tab>("console");

  const compileText =
    (result?.compile?.stderr || "") + (result?.compile?.stdout || "");
  const hasCompileErr = !!result?.compile && (result.compile.code ?? 0) !== 0;

  function resolvePath(fileRef: string): string | null {
    if (fileRef === "prog.java" && entryPath) return entryPath;
    const hit = knownFiles.find(
      (p) => p === fileRef || p.endsWith("/" + fileRef) || p.split("/").pop() === fileRef,
    );
    return hit ?? null;
  }

  function linkify(text: string): ReactNode[] {
    const out: ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    LINE_RE.lastIndex = 0;
    let key = 0;
    while ((m = LINE_RE.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      const [whole, file, lineStr] = m;
      const path = resolvePath(file);
      const line = parseInt(lineStr, 10);
      if (path && onJump) {
        out.push(
          <button
            key={key++}
            onClick={() => onJump(path, line)}
            className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent-2"
          >
            {whole}
          </button>,
        );
      } else {
        out.push(whole);
      }
      last = m.index + whole.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }

  const TABS: { id: Tab; label: string; dot?: boolean }[] = [
    { id: "console", label: "Console" },
    { id: "compile", label: "Compile", dot: hasCompileErr },
    { id: "test", label: "Test" },
  ];

  return (
    <div className="terminal-surface flex h-full flex-col">
      <div className="flex items-center justify-between border-y bg-surface-2 pr-3">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3.5 py-1.5 text-xs font-medium ${
                tab === t.id
                  ? "text-accent"
                  : "text-muted hover:text-text"
              }`}
            >
              {t.label}
              {t.dot && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-hard" />
              )}
              {tab === t.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>
        <StatusLine result={result} loading={loading} />
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed">
        {loading ? (
          <Brewing />
        ) : !result ? (
          <p className="text-muted">
            Klik op <span className="text-accent">Run</span> (of Ctrl+Enter)
            om je code uit te voeren.
          </p>
        ) : !result.ok ? (
          <pre className="whitespace-pre-wrap text-hard">
            {result.error ?? "Onbekende fout."}
          </pre>
        ) : tab === "console" ? (
          <Console result={result} />
        ) : tab === "compile" ? (
          <div>
            {compileText.trim() ? (
              <pre
                className={`whitespace-pre-wrap ${hasCompileErr ? "text-hard" : "text-muted"}`}
              >
                {linkify(compileText)}
              </pre>
            ) : (
              <p className="flex items-center gap-1.5 text-easy">
                <span className="status-dot bg-easy" /> gecompileerd zonder fouten
              </p>
            )}
          </div>
        ) : (
          <div>{testSlot ?? <p className="text-muted">Nog geen test uitgevoerd.</p>}</div>
        )}
      </div>
    </div>
  );
}

function Console({ result }: { result: ExecResult }) {
  const out = result.run?.stdout ?? "";
  const err = result.run?.stderr ?? "";
  return (
    <div>
      {out && <pre className="whitespace-pre-wrap text-text">{out}</pre>}
      {err && <pre className="whitespace-pre-wrap text-hard">{err}</pre>}
      {!out && !err && (
        <p className="text-muted">(geen uitvoer)</p>
      )}
    </div>
  );
}

function StatusLine({
  result,
  loading,
}: {
  result: ExecResult | null;
  loading: boolean;
}) {
  if (loading) return null;
  if (!result || !result.ok) return null;
  const code = result.run?.code ?? null;
  const ms = result.wallTimeMs;
  return (
    <div className="flex items-center gap-3 text-[11px] text-muted">
      {result.backend && <span className="opacity-70">via {result.backend}</span>}
      {ms != null && <span>{(ms / 1000).toFixed(2)}s</span>}
      <span className={code === 0 ? "text-easy" : "text-hard"}>
        exit {code ?? "?"}
      </span>
    </div>
  );
}

function Brewing() {
  return (
    <div className="flex items-center gap-2 font-mono text-[12.5px] text-muted">
      <span className="text-accent">$</span>
      <span>compileren en uitvoeren</span>
      <span className="inline-block h-3.5 w-[7px] animate-blink bg-accent align-middle" />
    </div>
  );
}
