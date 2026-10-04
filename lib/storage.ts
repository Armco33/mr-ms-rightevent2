export function safeRead<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch { return fallback; }
}

export function safeWrite<T>(key: string, value: T) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ }
}

export const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
