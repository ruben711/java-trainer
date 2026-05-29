export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  target: number;
  metric: "solved" | "streak" | "level" | "hardSolved";
}

export interface BadgeProgress {
  def: BadgeDef;
  earned: boolean;
  current: number;
  progress: number; // 0..1
}

export interface BadgeMetrics {
  solved: number;
  hardSolved: number;
  streak: number;
  level: number;
}

/**
 * Basis-badges (volume / streak / level). Hoofdstuk- en
 * moeilijkheidsspecifieke badges komen erbij zodra de oefeningen-data
 * bestaat.
 */
export const BADGES: BadgeDef[] = [
  { id: "first-sip", name: "Eerste slok", emoji: "☕", desc: "Los je eerste oefening op", target: 1, metric: "solved" },
  { id: "caffeinated", name: "Cafeïne", emoji: "⚡", desc: "Los 10 oefeningen op", target: 10, metric: "solved" },
  { id: "barista", name: "Barista", emoji: "🥇", desc: "Los 25 oefeningen op", target: 25, metric: "solved" },
  { id: "roaster", name: "Brander", emoji: "🫘", desc: "Los 50 oefeningen op", target: 50, metric: "solved" },
  { id: "streak-3", name: "Op dreef", emoji: "🔥", desc: "3 dagen op rij actief", target: 3, metric: "streak" },
  { id: "streak-7", name: "Vaste klant", emoji: "📅", desc: "7 dagen op rij actief", target: 7, metric: "streak" },
  { id: "level-5", name: "Gevorderd", emoji: "🌟", desc: "Bereik level 5", target: 5, metric: "level" },
  { id: "hard-5", name: "Pittig", emoji: "🌶️", desc: "Los 5 moeilijke oefeningen op", target: 5, metric: "hardSolved" },
];

export function evaluateBadges(m: BadgeMetrics): BadgeProgress[] {
  return BADGES.map((def) => {
    const current = m[def.metric];
    return {
      def,
      current,
      earned: current >= def.target,
      progress: Math.max(0, Math.min(1, current / def.target)),
    };
  });
}
