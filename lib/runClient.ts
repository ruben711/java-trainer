import type { ExecFile, ExecResult } from "./types";
import { useStore } from "./store";

/** Client-side: roept onze eigen /api/run route aan (die de backend kiest). */
export async function executeJava(
  files: ExecFile[],
  stdin = "",
): Promise<ExecResult> {
  // Anonieme sessie-id meesturen zodat de rate-limit per gebruiker geldt
  // (niet per IP — anders blokkeren klasgenoten op één netwerk elkaar).
  let sessionId = "";
  try {
    sessionId = useStore.getState().uid || "";
  } catch {}

  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(sessionId ? { "x-jt-session": sessionId } : {}),
      },
      body: JSON.stringify({ files, stdin }),
    });
    return (await res.json()) as ExecResult;
  } catch (e: any) {
    return {
      ok: false,
      error: "Netwerkfout bij uitvoeren: " + (e?.message ?? "onbekend"),
    };
  }
}
