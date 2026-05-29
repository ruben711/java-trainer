import { upstashConfigured, pipeline } from "./upstash";

export interface RateResult {
  allowed: boolean;
  retryAfterMs: number;
}

// Fallback wanneer Upstash niet geconfigureerd is. key -> window-einde (ms epoch).
const mem = new Map<string, number>();

/**
 * Atomische rate-limit: max 1 toegelaten call per `windowMs` per key.
 *
 * Gebruikt Upstash (`SET key 1 NX PX`) wanneer geconfigureerd — robuust op
 * Vercel serverless, waar in-memory state niet betrouwbaar overleeft tussen
 * instances. Zonder Upstash valt hij terug op een in-memory map (best-effort,
 * prima voor één instance / lokaal).
 */
export async function rateLimit(key: string, windowMs: number): Promise<RateResult> {
  if (upstashConfigured()) {
    try {
      const [setRes, pttl] = await pipeline([
        ["SET", key, "1", "NX", "PX", String(windowMs)],
        ["PTTL", key],
      ]);
      const allowed = setRes === "OK";
      const ttl = typeof pttl === "number" && pttl > 0 ? pttl : windowMs;
      return { allowed, retryAfterMs: allowed ? 0 : ttl };
    } catch {
      // Upstash even onbereikbaar → val terug op in-memory.
    }
  }

  const now = Date.now();
  const until = mem.get(key) ?? 0;
  if (now < until) return { allowed: false, retryAfterMs: until - now };
  mem.set(key, now + windowMs);
  if (mem.size > 5000) {
    for (const [k, v] of mem) if (v <= now) mem.delete(k);
  }
  return { allowed: true, retryAfterMs: 0 };
}
