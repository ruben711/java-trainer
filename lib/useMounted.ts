import { useEffect, useState } from "react";

/**
 * True pas na de eerste client-render. Gebruik dit in elk component dat
 * persisted Zustand-state of localStorage leest, om SSR-hydration
 * mismatches te vermijden.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
