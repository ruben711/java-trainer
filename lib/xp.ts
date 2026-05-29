export const XP_PER_SOLVE = 25;

/** Insane-oefeningen geven 0 XP ("voor tryhards"). */
export const XP_BY_DIFFICULTY: Record<string, number> = {
  easy: XP_PER_SOLVE,
  medium: XP_PER_SOLVE,
  hard: XP_PER_SOLVE,
  insane: 0,
};

export const BASE_LEVEL_XP = 100;
export const LEVEL_FACTOR = 1.25;

export interface LevelInfo {
  level: number;
  intoLevel: number;
  neededForNext: number;
  progress: number; // 0..1 binnen het huidige level
  totalXp: number;
}

/** Level uit totale XP. Level 1→2 kost 100, daarna ×1.25 per level. */
export function levelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let need = BASE_LEVEL_XP;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = Math.round(need * LEVEL_FACTOR);
  }
  return {
    level,
    intoLevel: remaining,
    neededForNext: need,
    progress: need > 0 ? remaining / need : 0,
    totalXp,
  };
}
