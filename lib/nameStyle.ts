export interface NameStyle {
  color?: string; // hex
  gradient?: [string, string];
  glow?: boolean;
  bold?: boolean;
  rainbow?: boolean;
  pulse?: boolean;
  shake?: boolean;
  font?: "default" | "mono" | "pixel";
  particle?: "none" | "sparkle" | "snow" | "fire" | "stars" | "hearts";
}

export interface CustomTag {
  label: string;
  color: string; // hex
  emoji?: string;
}

export interface TagDef {
  id: string;
  label: string;
  color: string;
  emoji?: string;
  xp: number; // XP-drempel om te ontgrendelen
  gold?: boolean; // extra gouden glans
}

/** Tags worden ontgrendeld naarmate je XP verdient. Geen emojis — enkel kleur + gloed. */
export const TAG_CATALOG: TagDef[] = [
  { id: "greenhorn",        label: "Greenhorn",         color: "#10b981", xp: 0 },
  { id: "codeknutselaar",   label: "Codeknutselaar",    color: "#06b6d4", xp: 50 },
  { id: "bytewever",        label: "Bytewever",         color: "#a855f7", xp: 150 },
  { id: "bug-jager",        label: "Bug-jager",         color: "#ef4444", xp: 300 },
  { id: "refactor-virtuoos",label: "Refactor-virtuoos", color: "#6366f1", xp: 600 },
  { id: "codelegende",      label: "Codelegende",       color: "#fbbf24", xp: 1000, gold: true },
];

export function tagDefToCustom(d: TagDef): CustomTag {
  return { label: d.label, color: d.color, emoji: d.emoji };
}

export function isGoldTagLabel(label: string): boolean {
  return TAG_CATALOG.some((d) => d.gold && d.label === label);
}

/** Tier-index 1..6 voor catalogus-tags, 0 voor vrije custom tags. */
export function tierForLabel(label: string): number {
  const idx = TAG_CATALOG.findIndex((d) => d.label === label);
  return idx >= 0 ? idx + 1 : 0;
}

export const PARTICLE_EMOJI: Record<string, string> = {
  sparkle: "✨",
  snow: "❄️",
  fire: "🔥",
  stars: "⭐",
  hearts: "💛",
};

export function safeNameStyle(raw: any): NameStyle | null {
  if (!raw || typeof raw !== "object") return null;
  const s: NameStyle = {};
  if (typeof raw.color === "string") s.color = raw.color.slice(0, 9);
  if (Array.isArray(raw.gradient) && raw.gradient.length === 2)
    s.gradient = [String(raw.gradient[0]).slice(0, 9), String(raw.gradient[1]).slice(0, 9)];
  s.glow = !!raw.glow;
  s.bold = !!raw.bold;
  s.rainbow = !!raw.rainbow;
  s.pulse = !!raw.pulse;
  s.shake = !!raw.shake;
  if (["default", "mono", "pixel"].includes(raw.font)) s.font = raw.font;
  if (["none", "sparkle", "snow", "fire", "stars", "hearts"].includes(raw.particle))
    s.particle = raw.particle;
  return s;
}

export function safeCustomTag(raw: any): CustomTag | null {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.label !== "string" || !raw.label.trim()) return null;
  return {
    label: raw.label.slice(0, 20),
    color: typeof raw.color === "string" ? raw.color.slice(0, 9) : "#f89820",
    emoji: typeof raw.emoji === "string" ? raw.emoji.slice(0, 4) : undefined,
  };
}
