"use client";

import { useEffect, useState } from "react";
import type { LbEntry } from "@/lib/leaderboardStore";
import type { JtEvent } from "@/lib/logger";
import type { NotifType } from "@/lib/notifications";

type Status = "loading" | "configured-off" | "login" | "in";

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [tab, setTab] = useState<"lb" | "notify" | "activity">("lb");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.configured) setStatus("configured-off");
        else setStatus(d.authed ? "in" : "login");
      })
      .catch(() => setStatus("login"));
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("login");
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-md px-4 py-20 text-center text-muted">Laden…</div>;
  }
  if (status === "configured-off") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Admin niet geconfigureerd</h1>
        <p className="mt-3 text-sm text-muted">
          Zet <code className="font-mono text-accent">ADMIN_PASSWORD</code> en{" "}
          <code className="font-mono text-accent">ADMIN_SECRET</code> in{" "}
          <code className="font-mono">.env.local</code> en herstart de server.
        </p>
      </div>
    );
  }
  if (status === "login") {
    return <LoginForm onSuccess={() => setStatus("in")} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
        <span className="eyebrow">Admin · console</span>
        <span className="chip-run">verbonden</span>
        <button onClick={logout} className="btn-ghost ml-auto h-7 !py-0 text-xs">
          Afmelden
        </button>
      </div>
      <div className="mt-4 flex gap-1 border-b">
        {([
          ["lb", "Leaderboard"],
          ["notify", "Meldingen"],
          ["activity", "Activiteit"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative px-4 py-2 text-sm font-medium ${
              tab === id ? "text-accent" : "text-muted hover:text-text"
            }`}
          >
            {label}
            {tab === id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === "lb" && <LeaderboardTab />}
        {tab === "notify" && <NotifyTab />}
        {tab === "activity" && <ActivityTab />}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) onSuccess();
    else setError((await res.json().catch(() => ({}))).error || "Mislukt.");
  }
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Wachtwoord"
          className="input"
          autoFocus
        />
        {error && <p className="text-sm text-hard">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">
          {busy ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}

function LeaderboardTab() {
  const [entries, setEntries] = useState<LbEntry[]>([]);
  const [configured, setConfigured] = useState(true);

  async function load() {
    const d = await (await fetch("/api/admin/leaderboard")).json();
    setConfigured(!!d.configured);
    setEntries(d.entries || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function update(uid: string, patch: any) {
    await fetch("/api/admin/leaderboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ uid, ...patch }),
    });
    load();
  }
  async function remove(uid: string) {
    if (!confirm("Deze gebruiker verwijderen?")) return;
    await fetch("/api/admin/leaderboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ uid, action: "delete" }),
    });
    load();
  }

  if (!configured)
    return <p className="text-sm text-muted">Upstash niet geconfigureerd.</p>;

  return (
    <div className="space-y-2">
      {entries.length === 0 && <p className="text-sm text-muted">Nog geen gebruikers.</p>}
      {entries.map((e) => (
        <AdminRow key={e.uid} entry={e} onUpdate={update} onRemove={remove} />
      ))}
    </div>
  );
}

function AdminRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: LbEntry;
  onUpdate: (uid: string, patch: any) => void;
  onRemove: (uid: string) => void;
}) {
  const [name, setName] = useState(entry.name);
  const [xp, setXp] = useState(String(entry.xp));
  const [solved, setSolved] = useState(String(entry.solved));
  return (
    <div className="card flex flex-wrap items-center gap-2 p-3 text-sm">
      <input value={name} onChange={(e) => setName(e.target.value)} className="input h-8 max-w-[10rem]" />
      <label className="flex items-center gap-1">XP<input value={xp} onChange={(e) => setXp(e.target.value)} className="input h-8 w-20" /></label>
      <label className="flex items-center gap-1">Opgelost<input value={solved} onChange={(e) => setSolved(e.target.value)} className="input h-8 w-16" /></label>
      <button
        onClick={() => onUpdate(entry.uid, { name, xp: Number(xp), solved: Number(solved) })}
        className="btn-secondary h-8 text-xs"
      >
        Bewaar
      </button>
      <button
        onClick={() => onUpdate(entry.uid, { isAdmin: !entry.isAdmin })}
        className={`btn h-8 border text-xs ${entry.isAdmin ? "border-accent text-accent" : "text-muted"}`}
      >
        {entry.isAdmin ? "👑 Admin" : "Maak admin"}
      </button>
      <button onClick={() => onRemove(entry.uid)} className="btn-ghost h-8 text-xs text-hard">
        Verwijder
      </button>
    </div>
  );
}

function NotifyTab() {
  const [entries, setEntries] = useState<LbEntry[]>([]);
  const [target, setTarget] = useState("all");
  const [type, setType] = useState<NotifType>("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => {});
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/notify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target, type, title, message }),
    });
    if (res.ok) {
      setSent(true);
      setTitle("");
      setMessage("");
      setTimeout(() => setSent(false), 2500);
    }
  }
  return (
    <form onSubmit={send} className="card max-w-lg space-y-3 p-4 text-sm">
      <div className="flex gap-2">
        <select value={target} onChange={(e) => setTarget(e.target.value)} className="input h-9">
          <option value="all">Alle gebruikers</option>
          {entries.map((e) => (
            <option key={e.uid} value={e.uid}>{e.name}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as NotifType)} className="input h-9 max-w-[8rem]">
          <option value="info">Info</option>
          <option value="success">Succes</option>
          <option value="warning">Waarschuwing</option>
          <option value="error">Fout</option>
        </select>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" className="input" required />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bericht" className="input h-24 resize-none" required />
      <button className="btn-primary">{sent ? "Verzonden ✓" : "Verstuur melding"}</button>
    </form>
  );
}

function ActivityTab() {
  const [events, setEvents] = useState<JtEvent[]>([]);
  const [configured, setConfigured] = useState(true);
  useEffect(() => {
    const load = () =>
      fetch("/api/admin/sessions")
        .then((r) => r.json())
        .then((d) => {
          setConfigured(!!d.configured);
          setEvents(d.events || []);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 20_000);
    return () => clearInterval(id);
  }, []);
  if (!configured) return <p className="text-sm text-muted">Upstash niet geconfigureerd.</p>;
  return (
    <div className="card divide-y text-sm">
      {events.length === 0 && <p className="p-4 text-muted">Nog geen activiteit.</p>}
      {events.map((ev, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2">
          <span className="chip border-border text-muted">{ev.type}</span>
          <span className="flex-1 truncate">
            <strong>{ev.name || ev.uid.slice(0, 6)}</strong> {ev.detail}
            {ev.country && <span className="ml-1 text-muted">· {ev.country}</span>}
          </span>
          <span className="text-xs text-muted">{new Date(ev.at).toLocaleTimeString("nl-BE")}</span>
        </div>
      ))}
    </div>
  );
}
