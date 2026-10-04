"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES, INTERESTS, VIBES, type Decision, type Preferences } from "@/lib/types";

const STORAGE = {
  preferences: "nextplan.preferences.v1",
  saved: "nextplan.saved.v1",
  skipped: "nextplan.skipped.v1",
  checkins: "nextplan.checkins.v1",
};

type AppState = {
  hydrated: boolean;
  preferences: Preferences | null;
  saved: string[];
  skipped: string[];
  checkins: string[];
  lastDecision: Decision | null;
  setPreferences: (value: Preferences) => void;
  saveEvent: (id: string) => void;
  skipEvent: (id: string) => void;
  toggleSaved: (id: string) => void;
  undo: () => void;
  demoCheckIn: (id: string) => void;
};

const AppContext = createContext<AppState | null>(null);

function readArray(key: string) {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? [...new Set(parsed)] : [];
  } catch {
    return [];
  }
}

function readPreferences(): Preferences | null {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE.preferences) ?? "null");
    if (!raw || typeof raw !== "object") return null;
    const value = raw as Partial<Preferences>;
    const interests = Array.isArray(value.interests) ? value.interests.filter((item): item is Preferences["interests"][number] => INTERESTS.includes(item as never)) : [];
    const vibes = Array.isArray(value.vibes) ? value.vibes.filter((item): item is Preferences["vibes"][number] => VIBES.includes(item as never)) : [];
    if (typeof value.city !== "string" || typeof value.maxDistance !== "number" || typeof value.maxPrice !== "number" || typeof value.freeOnly !== "boolean") return null;
    return { ...DEFAULT_PREFERENCES, ...value, interests, vibes, name: typeof value.name === "string" ? value.name : "" };
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [preferences, setPreferencesState] = useState<Preferences | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [checkins, setCheckins] = useState<string[]>([]);
  const [lastDecision, setLastDecision] = useState<Decision | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreferencesState(readPreferences());
      setSaved(readArray(STORAGE.saved));
      setSkipped(readArray(STORAGE.skipped));
      setCheckins(readArray(STORAGE.checkins));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE.saved, JSON.stringify(saved)); }, [saved, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE.skipped, JSON.stringify(skipped)); }, [skipped, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE.checkins, JSON.stringify(checkins)); }, [checkins, hydrated]);

  const setPreferences = useCallback((value: Preferences) => {
    setPreferencesState(value);
    localStorage.setItem(STORAGE.preferences, JSON.stringify(value));
  }, []);

  const saveEvent = useCallback((id: string) => {
    setSaved((current) => {
      const wasSaved = current.includes(id);
      setLastDecision({ eventId: id, action: "saved", wasSaved });
      return wasSaved ? current : [...current, id];
    });
    setSkipped((current) => current.filter((item) => item !== id));
  }, []);

  const skipEvent = useCallback((id: string) => {
    setSaved((current) => {
      setLastDecision({ eventId: id, action: "skipped", wasSaved: current.includes(id) });
      return current;
    });
    setSkipped((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setSkipped((current) => current.filter((item) => item !== id));
  }, []);

  const undo = useCallback(() => {
    if (!lastDecision) return;
    const { eventId, action, wasSaved } = lastDecision;
    if (action === "saved" && !wasSaved) setSaved((current) => current.filter((item) => item !== eventId));
    if (action === "skipped") {
      setSkipped((current) => current.filter((item) => item !== eventId));
      if (wasSaved) setSaved((current) => current.includes(eventId) ? current : [...current, eventId]);
    }
    setLastDecision(null);
  }, [lastDecision]);

  const demoCheckIn = useCallback((id: string) => {
    setCheckins((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  const value = useMemo(() => ({ hydrated, preferences, saved, skipped, checkins, lastDecision, setPreferences, saveEvent, skipEvent, toggleSaved, undo, demoCheckIn }), [hydrated, preferences, saved, skipped, checkins, lastDecision, setPreferences, saveEvent, skipEvent, toggleSaved, undo, demoCheckIn]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
