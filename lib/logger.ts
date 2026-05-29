import { redis } from "./upstash";

export interface JtEvent {
  uid: string;
  name: string;
  type: string;
  detail: string;
  country?: string;
  at: number;
}

const EVENTS = "events";

export async function logEvent(e: Omit<JtEvent, "at">): Promise<void> {
  const ev: JtEvent = { ...e, at: Date.now() };
  await redis("LPUSH", EVENTS, JSON.stringify(ev));
  await redis("LTRIM", EVENTS, 0, 199);
  void forwardToDiscord(ev);
}

export async function getEvents(limit = 100): Promise<JtEvent[]> {
  const raw = await redis("LRANGE", EVENTS, 0, limit - 1);
  return (Array.isArray(raw) ? raw : [])
    .map((s: string) => {
      try {
        return JSON.parse(s) as JtEvent;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as JtEvent[];
}

async function forwardToDiscord(ev: JtEvent): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: `**${ev.type}** · ${ev.name || ev.uid.slice(0, 6)} ${ev.country ? "(" + ev.country + ")" : ""} — ${ev.detail}`,
      }),
    });
  } catch {
    /* webhook is best-effort */
  }
}
