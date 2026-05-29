import type { Difficulty } from "./store";
import { CHAPTERS } from "@/data/chapters";
import { EXERCISES } from "@/data/exercises";

export type { Difficulty };

export interface ExerciseFile {
  name: string;
  content: string;
}

export interface StaticCheck {
  pattern: string;
  flags?: string;
  message: string;
  /** true (default): code MOET matchen. false: code mag NIET matchen. */
  mustMatch?: boolean;
}

export interface Grading {
  type: "output" | "tests" | "static";
  /** type "output" */
  expectedOutput?: string;
  /** type "tests" — verborgen test-klasse die aan de student-files wordt toegevoegd */
  testFile?: ExerciseFile;
  successMarker?: string;
  /** optioneel bij elk type: statische checks vóór uitvoering */
  staticChecks?: StaticCheck[];
}

export interface Exercise {
  id: string;
  chapterId: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  prompt: string; // markdown
  example?: string;
  starterFiles: ExerciseFile[];
  grading: Grading;
  solutionFiles?: ExerciseFile[];
  relatedConcepts?: string[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
}

export const DIFFICULTY_ORDER: Difficulty[] = [
  "easy",
  "medium",
  "hard",
  "insane",
];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Makkelijk",
  medium: "Gemiddeld",
  hard: "Moeilijk",
  insane: "Insane",
};

export function getChapters(): Chapter[] {
  return [...CHAPTERS].sort((a, b) => a.order - b.order);
}

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getAllExercises(): Exercise[] {
  return EXERCISES;
}

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function exercisesByChapter(chapterId: string): Exercise[] {
  return EXERCISES.filter((e) => e.chapterId === chapterId);
}

export function allTags(): string[] {
  const set = new Set<string>();
  for (const e of EXERCISES) for (const t of e.tags) set.add(t);
  return [...set].sort();
}
