import { executeJava } from "./runClient";
import { reorderMainFirst } from "./javaFiles";
import type { ExecFile, ExecResult } from "./types";
import type { Exercise, StaticCheck } from "./exercises";

export interface TestLine {
  name: string;
  ok: boolean;
  detail?: string; // bv. "verwacht: 3 · kreeg: 0"
}

export interface GradeResult {
  passed: boolean;
  message: string;
  exec?: ExecResult;
  testLines?: TestLine[];
  staticFailures?: string[];
  expected?: string;
  got?: string;
}

export const DEFAULT_MARKER = "ALLE TESTS GESLAAGD";

/** Normaliseer output: CRLF→LF, trailing spaces weg, trailing newlines weg. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "")
    .trim();
}

export function runStaticChecks(
  files: ExecFile[],
  checks: StaticCheck[],
): string[] {
  const code = files.map((f) => f.content).join("\n\n");
  const failures: string[] = [];
  for (const c of checks) {
    let re: RegExp;
    try {
      re = new RegExp(c.pattern, c.flags ?? "");
    } catch {
      continue;
    }
    const matched = re.test(code);
    const mustMatch = c.mustMatch !== false;
    if (matched !== mustMatch) failures.push(c.message);
  }
  return failures;
}

function parseTestLines(stdout: string): TestLine[] {
  const lines: TestLine[] = [];
  for (const raw of stdout.split("\n")) {
    const m = raw.match(/^\[(OK|FOUT)\]\s+(.*)$/);
    if (m) {
      const parts = m[2].split(" | ");
      const detail = parts.slice(1).join(" · ").trim();
      lines.push({ ok: m[1] === "OK", name: parts[0].trim(), detail: detail || undefined });
    }
  }
  return lines;
}

/**
 * Beoordeelt een oplossing. `studentFiles` zijn de bestanden uit de IDE
 * (name = pad, content = code).
 */
export async function gradeExercise(
  exercise: Exercise,
  studentFiles: ExecFile[],
): Promise<GradeResult> {
  const { grading } = exercise;

  // 1. Statische checks (pre-filter, geen uitvoering)
  if (grading.staticChecks?.length) {
    const failures = runStaticChecks(studentFiles, grading.staticChecks);
    if (failures.length) {
      return {
        passed: false,
        message: "Je code mist nog enkele vereisten:",
        staticFailures: failures,
      };
    }
  }

  if (grading.type === "static") {
    return { passed: true, message: "Structuur in orde ✓" };
  }

  if (grading.type === "output") {
    const exec = await executeJava(reorderMainFirst(studentFiles));
    if (!exec.ok) {
      return { passed: false, message: exec.error ?? "Uitvoering mislukt.", exec };
    }
    if (exec.compile && (exec.compile.code ?? 0) !== 0) {
      return { passed: false, message: "Je code compileert niet.", exec };
    }
    const got = normalizeOutput(exec.run?.stdout ?? "");
    const want = normalizeOutput(grading.expectedOutput ?? "");
    const passed = got === want;
    return {
      passed,
      message: passed ? "Output klopt ✓" : "De output wijkt af van wat verwacht werd.",
      exec,
      expected: want,
      got,
    };
  }

  // type "tests": verborgen test-klasse als entry (eerst in de lijst → main)
  const marker = grading.successMarker ?? DEFAULT_MARKER;
  const testFile = grading.testFile!;
  const execFiles: ExecFile[] = [
    { name: testFile.name, content: testFile.content },
    ...studentFiles.filter((f) => f.name !== testFile.name),
  ];
  const exec = await executeJava(execFiles);
  if (!exec.ok) {
    return { passed: false, message: exec.error ?? "Uitvoering mislukt.", exec };
  }
  if (exec.compile && (exec.compile.code ?? 0) !== 0) {
    return {
      passed: false,
      message:
        "Je code compileert niet samen met de tests. Controleer de klasse- en methodenamen uit de opgave.",
      exec,
    };
  }
  const stdout = exec.run?.stdout ?? "";
  const testLines = parseTestLines(stdout);
  const passed = stdout.includes(marker);
  return {
    passed,
    message: passed
      ? "Alle tests geslaagd ✓"
      : "Niet alle tests slaagden — bekijk het Test-tabblad.",
    exec,
    testLines,
  };
}
