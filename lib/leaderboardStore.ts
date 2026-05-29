import { redis, pipeline } from "./upstash";
import { levelInfo } from "./xp";
import {
  safeCustomTag,
  safeNameStyle,
  type CustomTag,
  type NameStyle,
} from "./nameStyle";

export interface LbEntry {
  uid: string;
  name: string;
  xp: number;
  solved: number;
  level: number;
  isAdmin: boolean;
  customTag: CustomTag | null;
  nameStyle: NameStyle | null;
  updatedAt: number;
}

const USERS = "lb:users";
const userKey = (uid: string) => `lb:user:${uid}`;

function arrToObj(arr: any): Record<string, string> {
  const obj: Record<string, string> = {};
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length - 1; i += 2) obj[arr[i]] = arr[i + 1];
  } else if (arr && typeof arr === "object") {
    return arr as Record<string, string>;
  }
  return obj;
}

function parseEntry(uid: string, h: Record<string, string>): LbEntry {
  const xp = parseInt(h.xp || "0", 10) || 0;
  let customTag: CustomTag | null = null;
  let nameStyle: NameStyle | null = null;
  try { if (h.customTag) customTag = JSON.parse(h.customTag); } catch {}
  try { if (h.nameStyle) nameStyle = JSON.parse(h.nameStyle); } catch {}
  return {
    uid,
    name: h.name || "User",
    xp,
    solved: parseInt(h.solved || "0", 10) || 0,
    level: levelInfo(xp).level,
    isAdmin: h.isAdmin === "1",
    customTag,
    nameStyle,
    updatedAt: parseInt(h.updatedAt || "0", 10) || 0,
  };
}

export async function getEntry(uid: string): Promise<LbEntry | null> {
  const h = arrToObj(await redis("HGETALL", userKey(uid)));
  if (!Object.keys(h).length) return null;
  return parseEntry(uid, h);
}

export async function listEntries(): Promise<LbEntry[]> {
  const uids: string[] = (await redis("SMEMBERS", USERS)) || [];
  if (!uids.length) return [];
  const results = await pipeline(uids.map((u) => ["HGETALL", userKey(u)]));
  const entries: LbEntry[] = [];
  results.forEach((arr, i) => {
    const h = arrToObj(arr);
    if (Object.keys(h).length) entries.push(parseEntry(uids[i], h));
  });
  return entries.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
}

interface SelfSync {
  uid: string;
  name: string;
  xp: number;
  solved: number;
  nameStyle?: NameStyle | null;
  customTag?: CustomTag | null;
}

/** Upsert door de gebruiker zelf. Behoudt isAdmin altijd, en bestaande
 *  nameStyle/customTag tenzij die expliciet meegegeven worden. */
export async function upsertSelf(e: SelfSync): Promise<void> {
  const existing = arrToObj(await redis("HGETALL", userKey(e.uid)));
  const fields: string[] = [
    "uid", e.uid,
    "name", (e.name || "User").slice(0, 24),
    "xp", String(Math.max(0, Math.floor(e.xp))),
    "solved", String(Math.max(0, Math.floor(e.solved))),
    "isAdmin", existing.isAdmin || "0",
    "updatedAt", String(Date.now()),
  ];
  const nameStyle =
    e.nameStyle !== undefined ? e.nameStyle : existing.nameStyle ? JSON.parse(existing.nameStyle) : null;
  const customTag =
    e.customTag !== undefined ? e.customTag : existing.customTag ? JSON.parse(existing.customTag) : null;
  fields.push("nameStyle", nameStyle ? JSON.stringify(safeNameStyle(nameStyle)) : "");
  fields.push("customTag", customTag ? JSON.stringify(safeCustomTag(customTag)) : "");

  await redis("HSET", userKey(e.uid), ...fields);
  await redis("SADD", USERS, e.uid);
}

/** Admin-bewerking: overschrijft enkel de meegegeven velden. */
export async function adminUpdate(
  uid: string,
  patch: Partial<{
    name: string;
    xp: number;
    solved: number;
    isAdmin: boolean;
    nameStyle: NameStyle | null;
    customTag: CustomTag | null;
  }>,
): Promise<void> {
  const fields: string[] = [];
  if (patch.name !== undefined) fields.push("name", patch.name.slice(0, 24));
  if (patch.xp !== undefined) fields.push("xp", String(Math.max(0, Math.floor(patch.xp))));
  if (patch.solved !== undefined) fields.push("solved", String(Math.max(0, Math.floor(patch.solved))));
  if (patch.isAdmin !== undefined) fields.push("isAdmin", patch.isAdmin ? "1" : "0");
  if (patch.nameStyle !== undefined)
    fields.push("nameStyle", patch.nameStyle ? JSON.stringify(safeNameStyle(patch.nameStyle)) : "");
  if (patch.customTag !== undefined)
    fields.push("customTag", patch.customTag ? JSON.stringify(safeCustomTag(patch.customTag)) : "");
  if (!fields.length) return;
  fields.push("updatedAt", String(Date.now()));
  await redis("HSET", userKey(uid), ...fields);
  await redis("SADD", USERS, uid);
}

export async function deleteEntry(uid: string): Promise<void> {
  await redis("DEL", userKey(uid));
  await redis("SREM", USERS, uid);
}
