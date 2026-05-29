import { upstashConfigured, redis, pipeline } from "./upstash";

export interface RateResult {
  allowed: boolean;
  retryAfterMs: number;
}

// Fallback wanneer Upstash niet geconfigureerd is. key -> {teller, venster-einde}.
const mem = new Map<string, { count: number; reset: number }>();

/**
 * Fixed-window rate-limit: max `max` toegelaten calls per `windowMs` per key.
 *
 * Gebruikt Upstash (`INCR` + `PEXPIRE`) wanneer geconfigureerd — robuust op
 * Vercel serverless, waar in-memory state niet betrouwbaar overleeft tussen
 * instances. Zonder Upstash valt hij terug op een in-memory map (best-effort,
 * prima voor één instance / lokaal).
 */
export async function rateLimit(
  key: string,
  windowMs: number,
  max = 1,
): Promise<RateResult> {
  if (upstashConfigured()) {
    try {
      const [count, pttl] = await pipeline([
        ["INCR", key],
        ["PTTL", key],
      ]);
      // Eerste hit in dit venster (nog geen vervaltijd) → zet het venster.
      if (typeof pttl !== "number" || pttl < 0) {
        await redis("PEXPIRE", key, windowMs);
      }
      const allowed = (count as number) <= max;
      const ttl = typeof pttl === "number" && pttl > 0 ? pttl : windowMs;
      return { allowed, retryAfterMs: allowed ? 0 : ttl };
    } catch {
      // Upstash even onbereikbaar → val terug op in-memory.
    }
  }

  const now = Date.now();
  const b = mem.get(key);
  if (!b || now >= b.reset) {
    mem.set(key, { count: 1, reset: now + windowMs });
    if (mem.size > 5000) {
      for (const [k, v] of mem) if (v.reset <= now) mem.delete(k);
    }
    return { allowed: true, retryAfterMs: 0 };
  }
  b.count++;
  if (b.count <= max) return { allowed: true, retryAfterMs: 0 };
  return { allowed: false, retryAfterMs: b.reset - now };
}
