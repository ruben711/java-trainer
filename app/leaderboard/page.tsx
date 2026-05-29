"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { fetchLeaderboard, syncLeaderboard, type LeaderboardResponse } from "@/lib/leaderboardSync";
import StyledName from "@/components/StyledName";
import CustomTag from "@/components/CustomTag";
import { TAG_CATALOG, tagDefToCustom, type NameStyle } from "@/lib/nameStyle";

export default function LeaderboardPage() {
  const mounted = useMounted();
  const uid = useStore((s) => s.uid);
  const displayName = useStore((s) => s.displayName);
  const nameStyle = useStore((s) => s.nameStyle);
  const customTag = useStore((s) => s.customTag);
  const setDisplayName = useStore((s) => s.setDisplayName);
  const setNameStyle = useStore((s) => s.setNameStyle);
  const setCustomTag = useStore((s) => s.setCustomTag);
  const xp = useStore((s) => s.xp);

  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    useStore.getState().ensureIdentity();
    let alive = true;
    const tick = async () => {
      await syncLeaderboard();
      const res = await fetchLeaderboard();
      if (alive) setData(res);
    };
    tick();
    const id = setInterval(tick, 20_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  function queueSync() {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      await syncLeaderboard();
      setData(await fetchLeaderboard());
    }, 500);
  }

  function patchStyle(patch: Partial<NameStyle>) {
    setNameStyle({ ...(nameStyle ?? {}), ...patch });
    queueSync();
  }

  const entries = data?.entries ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
        <span className="eyebrow">Klassement</span>
        <span className="vsep" />
        <span className="text-[13px] text-muted">Leaderboard</span>
        <button onClick={() => setEditorOpen((o) => !o)} className="btn-secondary ml-auto h-8 !py-0 text-xs">
          <Settings size={13} /> Naam &amp; stijl
        </button>
      </div>

      {mounted && editorOpen && (
        <ProfileEditor
          name={displayName ?? ""}
          nameStyle={nameStyle}
          customTag={customTag}
          xp={xp}
          onName={(v) => { setDisplayName(v); queueSync(); }}
          onStyle={patchStyle}
          onTag={(t) => { setCustomTag(t); queueSync(); }}
        />
      )}

      {data && !data.configured && (
        <div className="card mt-6 p-5 text-sm text-muted">
          <p className="font-medium text-text">Leaderboard nog niet geconfigureerd</p>
          <p className="mt-1">
            Zet <code className="font-mono text-accent">UPSTASH_REDIS_REST_URL</code> en{" "}
            <code className="font-mono text-accent">UPSTASH_REDIS_REST_TOKEN</code> in{" "}
            <code className="font-mono">.env.local</code> om een gedeeld klassement te activeren.
            De rest van de app werkt ondertussen gewoon.
          </p>
        </div>
      )}

      {data && data.configured && (
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 text-left">#</th>
                <th className="px-4 py-2.5 text-left">Naam</th>
                <th className="px-4 py-2.5 text-right">Level</th>
                <th className="px-4 py-2.5 text-right">XP</th>
                <th className="px-4 py-2.5 text-right">Opgelost</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.uid}
                  className={`border-b last:border-0 ${e.uid === uid ? "bg-accent/10" : ""}`}
                >
                  <td className="px-4 py-2.5 text-muted">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <StyledName name={e.name} style={e.nameStyle} isAdmin={e.isAdmin} />
                      {e.customTag && <CustomTag tag={e.customTag} />}
                      {e.uid === uid && <span className="text-xs text-muted">(jij)</span>}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-accent">{e.level}</td>
                  <td className="px-4 py-2.5 text-right">{e.xp}</td>
                  <td className="px-4 py-2.5 text-right">{e.solved}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Nog niemand op het leaderboard. Los een oefening op om te verschijnen!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!data && <p className="mt-6 text-sm text-muted">Laden…</p>}
    </div>
  );
}

function ProfileEditor({
  name,
  nameStyle,
  customTag,
  xp,
  onName,
  onStyle,
  onTag,
}: {
  name: string;
  nameStyle: NameStyle | null;
  customTag: import("@/lib/nameStyle").CustomTag | null;
  xp: number;
  onName: (v: string) => void;
  onStyle: (p: Partial<NameStyle>) => void;
  onTag: (t: import("@/lib/nameStyle").CustomTag | null) => void;
}) {
  const s = nameStyle ?? {};
  return (
    <div className="card mt-4 space-y-4 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted">Naam</label>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          maxLength={24}
          placeholder="Je leaderboard-naam"
          className="input max-w-xs"
        />
        <span className="ml-2 text-sm text-muted">Voorbeeld:</span>
        <span className="text-base">
          <StyledName name={name || "User1234"} style={nameStyle} />
          {customTag && <span className="ml-2"><CustomTag tag={customTag} /></span>}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Toggle label="Glow" on={!!s.glow} onChange={(v) => onStyle({ glow: v })} />
        <Toggle label="Vet" on={!!s.bold} onChange={(v) => onStyle({ bold: v })} />
        <Toggle label="Regenboog" on={!!s.rainbow} onChange={(v) => onStyle({ rainbow: v })} />
        <Toggle label="Pulse" on={!!s.pulse} onChange={(v) => onStyle({ pulse: v })} />
        <Toggle label="Shake" on={!!s.shake} onChange={(v) => onStyle({ shake: v })} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          Kleur
          <input
            type="color"
            value={s.color ?? "#f89820"}
            onChange={(e) => onStyle({ color: e.target.value, gradient: undefined })}
            className="h-7 w-10 cursor-pointer rounded border bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2">
          Gradient
          <input
            type="color"
            value={s.gradient?.[0] ?? "#f89820"}
            onChange={(e) => onStyle({ gradient: [e.target.value, s.gradient?.[1] ?? "#5382a1"] })}
            className="h-7 w-10 cursor-pointer rounded border bg-transparent"
          />
          <input
            type="color"
            value={s.gradient?.[1] ?? "#5382a1"}
            onChange={(e) => onStyle({ gradient: [s.gradient?.[0] ?? "#f89820", e.target.value] })}
            className="h-7 w-10 cursor-pointer rounded border bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2">
          Font
          <select
            value={s.font ?? "default"}
            onChange={(e) => onStyle({ font: e.target.value as NameStyle["font"] })}
            className="h-8 rounded-md border bg-surface-2 px-2"
          >
            <option value="default">Standaard</option>
            <option value="mono">Mono</option>
            <option value="pixel">Pixel</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Deeltjes
          <select
            value={s.particle ?? "none"}
            onChange={(e) => onStyle({ particle: e.target.value as NameStyle["particle"] })}
            className="h-8 rounded-md border bg-surface-2 px-2"
          >
            <option value="none">Geen</option>
            <option value="sparkle">✨ Sparkle</option>
            <option value="snow">❄️ Sneeuw</option>
            <option value="fire">🔥 Vuur</option>
            <option value="stars">⭐ Sterren</option>
            <option value="hearts">💛 Hartjes</option>
          </select>
        </label>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Tag</span>
          <span className="text-xs text-muted">· {xp} XP verdiend — tags ontgrendelen met XP</span>
          <button
            onClick={() => onTag(null)}
            className="ml-1 text-xs text-muted underline hover:text-text"
          >
            geen tag
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TAG_CATALOG.map((d) => {
            const unlocked = xp >= d.xp;
            if (!unlocked) {
              return (
                <span
                  key={d.id}
                  className="jt-tag-locked"
                  title={`Ontgrendel bij ${d.xp} XP`}
                >
                  🔒 {d.label} · {d.xp} XP
                </span>
              );
            }
            return (
              <button
                key={d.id}
                onClick={() => onTag(tagDefToCustom(d))}
                className="transition hover:scale-105"
                title={`Kies de tag ${d.label}`}
              >
                <CustomTag tag={tagDefToCustom(d)} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
