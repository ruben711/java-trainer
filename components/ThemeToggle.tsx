"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import {
  getStoredTheme,
  setStoredTheme,
  systemPrefersDark,
} from "@/lib/theme";
import { useMounted } from "@/lib/useMounted";

export default function ThemeToggle() {
  const mounted = useMounted();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const mode = getStoredTheme();
    setDark(mode === "dark" || (mode === "system" && systemPrefersDark()));
  }, []);

  function toggle() {
    setDark(setStoredTheme(dark ? "light" : "dark"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Thema wisselen"
      title={dark ? "Naar licht thema" : "Naar donker thema"}
      className="btn-ghost h-7 w-7 !px-0 transition-transform active:scale-95"
    >
      {!mounted ? (
        <Moon size={15} strokeWidth={1.75} className="opacity-0" />
      ) : dark ? (
        <Sun size={15} strokeWidth={1.75} />
      ) : (
        <Moon size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}
