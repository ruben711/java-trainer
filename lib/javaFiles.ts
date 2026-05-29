import type { ProjectFile } from "./store";
import type { ExecFile } from "./types";

export function baseName(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? path : path.slice(i + 1);
}

export function dirName(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

export function classNameFromPath(path: string): string {
  return baseName(path).replace(/\.java$/i, "");
}

/** "dieren/dieren" → "dieren.dieren" (package-statement suggestie). */
export function packageFromDir(dir: string): string {
  return dir.replace(/\/+/g, ".").replace(/^\.|\.$/g, "");
}

export function isJava(path: string): boolean {
  return /\.java$/i.test(path);
}

export function hasMain(content: string): boolean {
  // Soepel: vangt elke `... void main(String ...)` (met/zonder public/static, varargs, enz.)
  return /\bvoid\s+main\s*\(\s*String/.test(content);
}

const PKG = (dir: string) => {
  const p = packageFromDir(dir);
  return p ? `package ${p};\n\n` : "";
};

export function skeletonClass(name: string, dir = ""): string {
  return `${PKG(dir)}public class ${name} {

}
`;
}

export function skeletonInterface(name: string, dir = ""): string {
  return `${PKG(dir)}public interface ${name} {

}
`;
}

export function skeletonMain(name: string, dir = ""): string {
  return `${PKG(dir)}public class ${name} {
    public static void main(String[] args) {
        System.out.println("Hallo, Java!");
    }
}
`;
}

/** Test-klasse met eigen assert-helpers (geen JUnit nodig). */
export function skeletonTest(name: string, dir = ""): string {
  return `${PKG(dir)}public class ${name} {
    static int geslaagd = 0, gefaald = 0;

    static void check(String naam, boolean ok) {
        if (ok) { geslaagd++; System.out.println("[OK]   " + naam); }
        else    { gefaald++; System.out.println("[FOUT] " + naam); }
    }

    static void checkEquals(String naam, Object verwacht, Object gekregen) {
        check(naam + "  (verwacht=" + verwacht + ", gekregen=" + gekregen + ")",
              java.util.Objects.equals(verwacht, gekregen));
    }

    public static void main(String[] args) {
        // Schrijf hier je checks, bijvoorbeeld:
        // checkEquals("som van 2 en 3", 5, Rekenen.som(2, 3));

        System.out.println();
        System.out.println(geslaagd + " geslaagd, " + gefaald + " gefaald.");
        if (gefaald == 0) System.out.println("ALLE TESTS GESLAAGD");
    }
}
`;
}

export function emptyFile(): string {
  return "";
}

/**
 * Zet de project-bestanden om naar een backend-onafhankelijke files-array.
 * Het bestand met `public static void main` komt vooraan (entry point).
 */
const SYNTHETIC_RUNNER: ExecFile = {
  name: "JTRunner.java",
  content: `public class JTRunner {
    public static void main(String[] args) {
        System.out.println("[info] Geen main-methode gevonden — je code is wel gecompileerd. Voeg een main toe om uitvoer te zien, of klik op Verbeteren om de tests te draaien.");
    }
}
`,
};

export function toExecFiles(files: ProjectFile[], entryPath?: string): ExecFile[] {
  const mapped: ExecFile[] = files.map((f) => ({
    name: f.path,
    content: f.content,
  }));

  // Geen enkele main? Voeg een synthetische runner toe zodat het project
  // tóch compileert en draait (i.p.v. "main class not found"). Zo kun je
  // élk bestand runnen, ook een library-klasse zonder main.
  if (!mapped.some((f) => isJava(f.name) && hasMain(f.content))) {
    return [SYNTHETIC_RUNNER, ...mapped];
  }

  // Draai het open bestand als entry point als het zelf een main heeft;
  // anders het bestand dat wél een main bevat.
  if (entryPath) {
    const i = mapped.findIndex((f) => f.name === entryPath);
    if (i >= 0 && isJava(mapped[i].name) && hasMain(mapped[i].content)) {
      if (i > 0) {
        const [entry] = mapped.splice(i, 1);
        mapped.unshift(entry);
      }
      return mapped;
    }
  }
  return reorderMainFirst(mapped);
}

/** Zet het bestand met een main-methode vooraan (de meeste runtimes nemen file[0] als entry). */
export function reorderMainFirst(files: ExecFile[]): ExecFile[] {
  const out = [...files];
  const idx = out.findIndex((f) => isJava(f.name) && hasMain(f.content));
  if (idx > 0) {
    const [main] = out.splice(idx, 1);
    out.unshift(main);
  }
  return out;
}

/**
 * Haalt de `public` modifier weg bij de eerste top-level type-declaratie.
 * Nodig voor Wandbox, dat het entry-bestand altijd `prog.java` noemt
 * (een `public class Main` zou anders een compile-fout geven).
 */
export function stripTopLevelPublic(content: string): string {
  return content.replace(
    /(^|\n)(\s*)public\s+((?:abstract\s+|final\s+|sealed\s+|non-sealed\s+)*(?:class|interface|enum|record)\b)/,
    "$1$2$3",
  );
}

/** Unieke bestandsnaam binnen een map ("Naam", "Naam2", …). */
export function uniqueName(
  existing: string[],
  dir: string,
  base: string,
  ext = ".java",
): string {
  const prefix = dir ? dir + "/" : "";
  let candidate = `${prefix}${base}${ext}`;
  let n = 2;
  const taken = new Set(existing);
  while (taken.has(candidate)) {
    candidate = `${prefix}${base}${n}${ext}`;
    n++;
  }
  return candidate;
}
