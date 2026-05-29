import type { ExecFile, ExecResult } from "./types";
import { stripTopLevelPublic } from "./javaFiles";

const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const COMPILER = process.env.WANDBOX_COMPILER || "openjdk-jdk-21+35";

/**
 * Wandbox-backend (gratis, geen key) — bedoeld als zero-setup fallback.
 * Quirk: het entry-bestand wordt altijd `prog.java` genoemd, dus de
 * entry-klasse mag niet `public` zijn. Overige bestanden gaan in `codes`
 * met hun echte naam.
 */
export async function runOnWandbox(
  files: ExecFile[],
  stdin = "",
  signal?: AbortSignal,
): Promise<ExecResult> {
  if (files.length === 0) {
    return { ok: false, backend: "wandbox", error: "Geen bestanden." };
  }

  // Entry = het eerste bestand (de open klasse / de testklasse). De caller
  // bepaalt de volgorde.
  const entry = files[0];
  const rest = files.slice(1);

  const body = {
    compiler: COMPILER,
    code: stripTopLevelPublic(entry.content),
    codes: rest.map((f) => ({ file: f.name, code: f.content })),
    stdin,
    save: false,
  };

  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e: any) {
    return {
      ok: false,
      backend: "wandbox",
      error: "Kon Wandbox niet bereiken: " + (e?.message ?? "netwerkfout"),
      wallTimeMs: Date.now() - started,
    };
  }

  const wallTimeMs = Date.now() - started;

  if (!res.ok) {
    return {
      ok: false,
      backend: "wandbox",
      error: `Wandbox gaf status ${res.status}.`,
      wallTimeMs,
    };
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    return {
      ok: false,
      backend: "wandbox",
      error: "Onleesbaar antwoord van Wandbox.",
      wallTimeMs,
    };
  }

  const compilerErr: string = data.compiler_error ?? "";
  const compilerOut: string = data.compiler_output ?? "";
  const exitCode =
    data.status === "" || data.status == null ? null : Number(data.status);

  return {
    ok: true,
    backend: "wandbox",
    version: COMPILER,
    language: "java",
    compile: {
      stdout: compilerOut,
      stderr: compilerErr,
      output: compilerErr || compilerOut,
      code: compilerErr ? 1 : 0,
      signal: null,
    },
    run: {
      stdout: data.program_output ?? "",
      stderr: data.program_error ?? "",
      output: data.program_message ?? "",
      code: exitCode,
      signal: data.signal || null,
    },
    wallTimeMs,
  };
}
