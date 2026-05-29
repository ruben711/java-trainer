import type { ExecFile, ExecResult, ExecStage } from "./types";

// Self-host default: let op, GEEN "/piston/" segment (anders dan de oude emkc-URL).
const PISTON_URL =
  process.env.PISTON_URL || "http://localhost:2000/api/v2/execute";
const JAVA_VERSION = process.env.PISTON_JAVA_VERSION || "*";
// Optioneel: gedeeld geheim zodat enkel deze app de (publieke) Piston-VPS mag aanspreken.
const PISTON_AUTH = process.env.PISTON_AUTH || "";

function stage(raw: any): ExecStage | undefined {
  if (!raw) return undefined;
  return {
    stdout: raw.stdout ?? "",
    stderr: raw.stderr ?? "",
    output: raw.output ?? "",
    code: raw.code ?? null,
    signal: raw.signal ?? null,
  };
}

/** Piston-backend (zelf-gehost of whitelisted). Stuurt alle .java-bestanden mee. */
export async function runOnPiston(
  files: ExecFile[],
  stdin = "",
  signal?: AbortSignal,
): Promise<ExecResult> {
  const body = {
    language: "java",
    version: JAVA_VERSION,
    files: files.map((f) => ({ name: f.name, content: f.content })),
    stdin,
    compile_timeout: 10_000,
    run_timeout: 8_000,
  };

  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(PISTON_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(PISTON_AUTH ? { authorization: `Bearer ${PISTON_AUTH}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e: any) {
    return {
      ok: false,
      backend: "piston",
      error:
        `Kon de Piston-server (${PISTON_URL}) niet bereiken: ` +
        (e?.message ?? "netwerkfout") +
        ". Draait je Piston-container? Of zet EXEC_BACKEND=wandbox om zonder setup te testen.",
      wallTimeMs: Date.now() - started,
    };
  }

  const wallTimeMs = Date.now() - started;

  if (!res.ok) {
    if (res.status === 429) {
      return {
        ok: false,
        backend: "piston",
        error:
          "Te veel verzoeken naar Piston (rate limit). Probeer over enkele seconden opnieuw.",
        wallTimeMs,
      };
    }
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      backend: "piston",
      error: `Piston gaf status ${res.status}. ${text.slice(0, 200)}`,
      wallTimeMs,
    };
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    return {
      ok: false,
      backend: "piston",
      error: "Onleesbaar antwoord van Piston.",
      wallTimeMs,
    };
  }

  return {
    ok: true,
    backend: "piston",
    compile: stage(data.compile),
    run: stage(data.run),
    language: data.language,
    version: data.version,
    wallTimeMs,
  };
}
