export const PALETTE_EVENT = "jt:open-palette";

/** Open de command palette van overal (header-chip, landing-launcher, …). */
export function openCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
  }
}
