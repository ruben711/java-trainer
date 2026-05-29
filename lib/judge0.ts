import type { ExecFile, ExecResult } from "./types";
import { isJava, hasMain, classNameFromPath, stripTopLevelPublic } from "./javaFiles";

// Standaard de gratis publieke instantie; zet JUDGE0_URL + JUDGE0_KEY naar de
// RapidAPI-versie voor productie-betrouwbaarheid (plug & play: enkel een key).
const JUDGE0_URL = (process.env.JUDGE0_URL || "https://ce.judge0.com").replace(/\/+$/, "");
const JUDGE0_KEY = process.env.JUDGE0_KEY || "";
const JAVA_LANGUAGE_ID = Number(process.env.JUDGE0_LANGUAGE_ID || 62); // OpenJDK 13

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const unb64 = (s: string | null | undefined) =>
  s ? Buffer.from(s, "base64").toString("utf8") : "";

function headers(): Record<string, string> {
  const h: Record<string, string> = { "content-type": "application/json" };
  if (JUDGE0_KEY) {
    h["X-RapidAPI-Key"] = JUDGE0_KEY;
    try {
      h["X-RapidAPI-Host"] = new URL(JUDGE0_URL).host;
    } catch {}
  }
  return h;
}

/**
 * Judge0 voert één bronbestand uit. We voegen alle .java-bestanden samen tot
 * één file (imports bovenaan, `public`/`package` weg zodat klassen samen mogen
 * bestaan) en hernoemen de entry-klasse naar `Main`, want Judge0 draait `java Main`.
 */
function mergeJava(files: ExecFile[]): string {
  const javaFiles = files.filter((f) => isJava(f.name));
  const imports = new Set<string>();
  const entryFile = javaFiles.find((f) => hasMain(f.content));
  const entryName = entryFile ? classNameFromPath(entryFile.name) : null;

  let bodies = javaFiles
    .map((f) => {
      let c = f.content
        .replace(/^[ \t]*package\s+[^;]+;[ \t]*\r?\n?/gm, "")
        .replace(/^[ \t]*import\s+[^;]+;[ \t]*\r?\n?/gm, (m) => {
          imports.add(m.trim());
          return "";
        });
      return stripTopLevelPublic(c).trim();
    })
    .join("\n\n");

  if (entryName && entryName !== "Main") {
    if (/\bclass\s+Main\b/.test(bodies)) bodies = bodies.replace(/\bMain\b/g, "Main_");
    bodies = bodies.replace(new RegExp(`\\b${entryName}\\b`, "g"), "Main");
  } else if (!entryName) {
    bodies +=
      '\n\nclass Main { public static void main(String[] a) { System.out.println("[info] Geen main-methode gevonden — je code is wel gecompileerd. Voeg een main toe of klik op Verbeteren."); } }';
  }

  const imp = [...imports].join("\n");
  return (imp ? imp + "\n\n" : "") + bodies + "\n";
}

export async function runOnJudge0(
  files: ExecFile[],
  stdin = "",
  signal?: AbortSignal,
): Promise<ExecResult> {
  const source = mergeJava(files);
  const started = Date.now();

  let res: Response;
  try {
    res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        source_code: b64(source),
        language_id: JAVA_LANGUAGE_ID,
        stdin: b64(stdin),
      }),
      signal,
    });
  } catch (e: any) {
    return {
      ok: false,
      backend: "judge0",
      error: "Kon Judge0 niet bereiken: " + (e?.message ?? "netwerkfout"),
      wallTimeMs: Date.now() - started,
    };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      backend: "judge0",
      error: `Judge0 gaf status ${res.status}. ${text.slice(0, 200)}`,
      wallTimeMs: Date.now() - started,
    };
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    return { ok: false, backend: "judge0", error: "Onleesbaar antwoord van Judge0." };
  }

  // Sommige instanties negeren wait=true en geven enkel een token → pollen.
  if (data?.token && !data.status) {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        const r = await fetch(
          `${JUDGE0_URL}/submissions/${data.token}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,exit_code,time`,
          { headers: headers(), signal },
        );
        data = await r.json();
        if (data?.status && data.status.id >= 3) break;
      } catch {
        break;
      }
    }
  }

  const wallTimeMs = Date.now() - started;
  const statusId: number = data?.status?.id ?? 0;
  const compileOut = unb64(data?.compile_output);
  const stdout = unb64(data?.stdout);
  let stderr = unb64(data?.stderr);
  if (statusId === 5) stderr = (stderr ? stderr + "\n" : "") + "Time Limit Exceeded.";

  return {
    ok: true,
    backend: "judge0",
    version: "Judge0",
    language: "java",
    compile: {
      stdout: "",
      stderr: compileOut,
      output: compileOut,
      code: statusId === 6 || compileOut.trim() ? 1 : 0,
      signal: null,
    },
    run: {
      stdout,
      stderr,
      output: stdout + stderr,
      code: data?.exit_code ?? (statusId === 3 ? 0 : statusId >= 6 ? 1 : null),
      signal: null,
    },
    wallTimeMs,
  };
}
