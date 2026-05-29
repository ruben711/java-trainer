import { useStore } from "./store";
import type { LbEntry } from "./leaderboardStore";

export interface LeaderboardResponse {
  configured: boolean;
  entries: LbEntry[];
  error?: string;
}

function solvedCount(): number {
  const p = useStore.getState().progress;
  return Object.values(p).filter((x) => x.solved).length;
}

/** Stuurt de huidige stats van deze gebruiker naar het leaderboard. */
export async function syncLeaderboard(): Promise<void> {
  const s = useStore.getState();
  if (!s.uid) return;
  try {
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        uid: s.uid,
        name: s.displayName ?? "User",
        xp: s.xp,
        solved: solvedCount(),
        nameStyle: s.nameStyle,
        customTag: s.customTag,
      }),
    });
  } catch {
    /* stilletjes negeren — leaderboard is optioneel */
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const res = await fetch("/api/leaderboard", { cache: "no-store" });
    return (await res.json()) as LeaderboardResponse;
  } catch {
    return { configured: false, entries: [] };
  }
}
