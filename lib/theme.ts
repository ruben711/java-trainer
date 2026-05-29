export type ThemeMode = "light" | "dark" | "system";

export const THEME_KEY = "jt-theme";

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemPrefersDark();
}

export function applyTheme(mode: ThemeMode): boolean {
  const dark = resolveDark(mode);
  const el = document.documentElement;
  el.classList.toggle("dark", dark);
  el.setAttribute("data-mode", dark ? "dark" : "light");
  return dark;
}

export function getStoredTheme(): ThemeMode {
  // Dark is de primaire theme — standaard wanneer er nog niets gekozen is.
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  return v === "light" || v === "dark" || v === "system" ? v : "dark";
}

export function setStoredTheme(mode: ThemeMode): boolean {
  localStorage.setItem(THEME_KEY, mode);
  return applyTheme(mode);
}

/** Inline script in <head> tegen theme-flash (FOUC) vóór hydration. */
export const THEME_INIT_SCRIPT = `(function(){try{var k='${THEME_KEY}';var t=localStorage.getItem(k);var sys=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=(t==='light')?false:(t==='system'?sys:true);var el=document.documentElement;el.classList.toggle('dark',dark);el.setAttribute('data-mode',dark?'dark':'light');}catch(e){var el=document.documentElement;el.classList.add('dark');}})();`;
