export interface ExecFile {
  name: string;
  content: string;
}

export interface ExecStage {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal?: string | null;
}

export interface ExecResult {
  ok: boolean;
  backend?: string; // "piston" | "wandbox" | "judge0"
  compile?: ExecStage;
  run?: ExecStage;
  language?: string;
  version?: string;
  error?: string;
  wallTimeMs?: number;
}

// Backwards-compatibele aliassen (sommige modules gebruiken de oude namen).
export type PistonFileIn = ExecFile;
export type PistonRunResult = ExecResult;
