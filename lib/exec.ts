import type { ExecFile, ExecResult } from "./types";
import { runOnPiston } from "./piston";
import { runOnWandbox } from "./wandbox";
import { runOnJudge0 } from "./judge0";

export type ExecBackend = "piston" | "wandbox" | "judge0";

export function activeBackend(): ExecBackend {
  // Default = judge0 (plug & play: werkt op Vercel zonder server, enkel een key
  // voor betrouwbaarheid). piston/wandbox blijven beschikbaar via EXEC_BACKEND.
  const b = (process.env.EXEC_BACKEND || "judge0").toLowerCase();
  if (b === "wandbox" || b === "piston") return b;
  return "judge0";
}

/** Kiest de execution-backend op basis van EXEC_BACKEND en voert de Java-code uit. */
export function executeJavaBackend(
  files: ExecFile[],
  stdin = "",
  signal?: AbortSignal,
): Promise<ExecResult> {
  switch (activeBackend()) {
    case "wandbox":
      return runOnWandbox(files, stdin, signal);
    case "judge0":
      return runOnJudge0(files, stdin, signal);
    case "piston":
    default:
      return runOnPiston(files, stdin, signal);
  }
}
