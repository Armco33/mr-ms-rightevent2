"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Grid2X2, RotateCcw, Rows3, SearchX } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { EventActions, EventCard } from "@/components/event-card";
import { GridEventCard } from "@/components/grid-event-card";
import { Filters, type FiltersValue } from "@/components/filters";
import { PageShell } from "@/components/page-shell";
import { DemoPill, LoadingState } from "@/components/ui";
import { events } from "@/lib/events";
import { distanceKm } from "@/lib/format";

export function DiscoverClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { hydrated, preferences, saved, skipped, lastDecision, saveEvent, skipEvent, toggleSaved, undo } = useApp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const view = params.get("view") === "grid" ? "grid" : "swipe";
  const filters: FiltersValue = {
    category: params.get("category") ?? "",
    vibe: params.get("vibe") ?? "",
    date: params.get("date") ?? "all",
    price: Number(params.get("price") ?? preferences?.maxPrice ?? 2000),
    distance: Number(params.get("distance") ?? preferences?.maxDistance ?? 20),
  };

  const setQuery = useCallback((next: Partial<FiltersValue> & { view?: string }) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === "" || value === "all") query.delete(key); else query.set(key, String(value));
    });
    router.replace(`/discover?${query.toString()}`, { scroll: false });
  }, [params, router]);

  const filtered = useMemo(() => events.filter((event) => {
    if (filters.category && event.category !== filters.category) return false;
    if (filters.vibe && !event.vibes.includes(filters.vibe as never)) return false;
    if (event.price > filters.price) return false;
    if (distanceKm(event) > filters.distance) return false;
    const month = new Date(event.startAt).getMonth();
    if (filters.date === "october" && month !== 9) return false;
    if (filters.date === "november" && month !== 10) return false;
    if (filters.date === "weekend" && ![0, 6].includes(new Date(event.startAt).getDay())) return false;
    return true;
  }), [filters.category, filters.vibe, filters.price, filters.distance, filters.date]);
  const available = filtered.filter((event) => !skipped.includes(event.id) && !saved.includes(event.id));
  const current = available[0];

  useEffect(() => {
    if (hydrated && !preferences) router.replace("/");
  }, [hydrated, preferences, router]);

  useEffect(() => {
    if (!hydrated) return;
    const onKey = (event: KeyboardEvent) => {
      if (view !== "swipe" || !current || ["INPUT", "SELECT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;
      if (event.key === "ArrowLeft") skipEvent(current.id);
      if (event.key === "ArrowRight") saveEvent(current.id);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, hydrated, saveEvent, skipEvent, undo, view]);

  if (!hydrated) return <PageShell><LoadingState label="Loading demo events" /></PageShell>;
  if (!preferences) return <LoadingState label="Opening setup" />;

  return <PageShell className="discover-page">
    <header className="page-header"><div><div className="discover-header-copy"><p className="eyebrow">Explore Taipei</p><DemoPill /></div><h1>Find your next plan.</h1></div><div style={{ display: "flex", gap: 8 }}><button className="btn btn-quiet mobile-filter-button" type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><Filter size={17} /> Filters</button><div className="view-toggle" aria-label="View selection"><Link className={view === "swipe" ? "active" : ""} href={`/discover?${new URLSearchParams({ ...Object.fromEntries(params), view: "swipe" })}`}><Rows3 size={16} /><span>Swipe</span></Link><Link className={view === "grid" ? "active" : ""} href={`/discover?${new URLSearchParams({ ...Object.fromEntries(params), view: "grid" })}`}><Grid2X2 size={16} /><span>Grid</span></Link></div></div></header>
    <div className="discover-layout">
      <Filters value={filters} open={filtersOpen} onChange={(value) => setQuery(value)} />
      <section aria-live="polite"><p className="result-count">{filtered.length} demo events match · {available.length} left to review</p>
        {view === "grid" ? (filtered.length ? <div className="grid-events">{filtered.map((event) => <GridEventCard key={event.id} event={event} saved={saved.includes(event.id)} onToggle={() => toggleSaved(event.id)} />)}</div> : <Empty />) : (current ? <div className="swipe-area"><div className="stack"><div className="stack-back" aria-hidden="true" /><EventCard key={current.id} event={current} preferences={preferences} onSave={() => saveEvent(current.id)} onSkip={() => skipEvent(current.id)} /></div><EventActions event={current} onSave={() => saveEvent(current.id)} onSkip={() => skipEvent(current.id)} /><div className="undo-row"><button className="undo-button" type="button" onClick={undo} disabled={!lastDecision}><RotateCcw size={14} /> Undo last decision</button></div></div> : <Empty />)}
      </section>
    </div>
  </PageShell>;
}

function Empty() {
  return <div className="empty-state"><div className="empty-icon"><SearchX size={28} /></div><h2>No more plans here</h2><p>Try widening your filters or undo your last decision. Your saved events are waiting in Saved.</p><Link className="btn btn-primary" href="/saved">View saved events</Link></div>;
}
