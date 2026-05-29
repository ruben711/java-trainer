"use client";

/**
 * XP-pop. De parent (re)mount dit met een unieke key wanneer er XP verdiend
 * wordt; de animatie speelt eenmalig af (zie keyframes "xp-pop").
 */
export default function XpToast({ amount }: { amount: number }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center">
      <div className="animate-xp-pop rounded-md bg-accent px-4 py-2 font-mono text-base font-semibold tabular-nums text-on-accent shadow-glow">
        +{amount} XP
      </div>
    </div>
  );
}
