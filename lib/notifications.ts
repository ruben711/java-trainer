import { redis } from "./upstash";

export type NotifType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  at: number;
}

const ALL = "notif:all";
const userKey = (uid: string) => `notif:user:${uid}`;

function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseList(arr: any): Notification[] {
  return (Array.isArray(arr) ? arr : [])
    .map((s: string) => {
      try {
        return JSON.parse(s) as Notification;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Notification[];
}

export async function pushNotification(
  target: "all" | string,
  n: { type: NotifType; title: string; message: string },
): Promise<Notification> {
  const notif: Notification = {
    id: newId(),
    type: n.type,
    title: n.title.slice(0, 80),
    message: n.message.slice(0, 400),
    at: Date.now(),
  };
  const key = target === "all" ? ALL : userKey(target);
  await redis("LPUSH", key, JSON.stringify(notif));
  await redis("LTRIM", key, 0, 49);
  return notif;
}

export async function getNotifications(uid: string): Promise<Notification[]> {
  const [allRaw, userRaw] = await Promise.all([
    redis("LRANGE", ALL, 0, 49),
    uid ? redis("LRANGE", userKey(uid), 0, 49) : Promise.resolve([]),
  ]);
  const merged = [...parseList(allRaw), ...parseList(userRaw)];
  merged.sort((a, b) => b.at - a.at);
  return merged.slice(0, 50);
}
