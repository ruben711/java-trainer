"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";

/**
 * Past het opgeslagen thema toe na hydration en volgt systeemwijzigingen
 * zolang de gebruiker op "system" staat. Later hangt hier ook de
 * xpRulesVersion-recalc onder.
 */
export default function ModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getStoredTheme());
    useStore.getState().ensureIdentity();
    const s = useStore.getState();
    fetch("/api/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ uid: s.uid, name: s.displayName, type: "visitor", detail: "bezoek" }),
    }).catch(() => {});
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return <>{children}</>;
}
