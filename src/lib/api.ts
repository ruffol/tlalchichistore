const API_URL = process.env.API_URL || "http://localhost:3001";

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
