const BASE = process.env.API_URL || "";

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
