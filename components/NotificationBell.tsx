"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Info, CircleCheck, TriangleAlert, CircleX, type LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import type { Notification } from "@/lib/notifications";

const TYPE_ICON: Record<string, { icon: LucideIcon; cls: string }> = {
  info: { icon: Info, cls: "text-accent-2" },
  success: { icon: CircleCheck, cls: "text-easy" },
  warning: { icon: TriangleAlert, cls: "text-medium" },
  error: { icon: CircleX, cls: "text-danger" },
};

export default function NotificationBell() {
  const mounted = useMounted();
  const lastSeen = useStore((s) => s.notifLastSeen);
  const markSeen = useStore((s) => s.markNotifsSeen);
  const [items, setItems] = useState<Notification[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    let alive = true;
    const poll = async () => {
      try {
        const uid = useStore.getState().uid;
        const res = await fetch(`/api/notifications?uid=${encodeURIComponent(uid)}`, { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        setConfigured(!!data.configured);
        setItems(data.notifications || []);
      } catch {
        /* ignore */
      }
    };
    poll();
    const id = setInterval(poll, 20_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || configured !== true) return null;

  const unread = items.filter((n) => n.at > lastSeen).length;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
          if (!open) markSeen();
        }}
        className="btn-ghost relative h-7 w-7 !px-0"
        aria-label="Meldingen"
      >
        <Bell size={15} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-[3px] bg-accent px-1 font-mono text-[9px] font-bold tabular-nums text-on-accent">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-50 mt-1.5 max-h-96 w-80 overflow-y-auto rounded-md border border-border bg-surface shadow-panel animate-fade-in"
        >
          <div className="panel-header">Meldingen</div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 px-3 py-7 text-center">
              <BellOff size={20} className="text-faint" />
              <p className="text-xs text-muted">Geen meldingen</p>
            </div>
          ) : (
            items.map((n) => {
              const t = TYPE_ICON[n.type] ?? TYPE_ICON.info;
              const Icon = t.icon;
              return (
                <div key={n.id} className="flex gap-2 border-b border-border px-3 py-2 last:border-0">
                  <Icon size={15} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${t.cls}`} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">{n.title}</p>
                    <p className="text-xs text-muted">{n.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
