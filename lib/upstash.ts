const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function upstashConfigured(): boolean {
  return !!(URL && TOKEN);
}

/** Eén Redis-commando via de Upstash REST API. Geeft null als niet geconfigureerd. */
export async function redis(...command: (string | number)[]): Promise<any> {
  if (!URL || !TOKEN) return null;
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Upstash " + res.status);
  const data = await res.json();
  return data.result;
}

/** Meerdere commando's in één pipeline-call. */
export async function pipeline(
  commands: (string | number)[][],
): Promise<any[]> {
  if (!URL || !TOKEN || commands.length === 0) return [];
  const res = await fetch(URL + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Upstash pipeline " + res.status);
  const data = await res.json();
  return data.map((d: any) => d.result);
}
