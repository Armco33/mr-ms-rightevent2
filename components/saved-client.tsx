"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkX, CalendarDays, ChevronLeft, ChevronRight, List, Trash2 } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { PageShell } from "@/components/page-shell";
import { DemoPill, LoadingState } from "@/components/ui";
import { events } from "@/lib/events";
import { formatDate, formatPrice, formatTime } from "@/lib/format";

export function SavedClient() {
  const { hydrated, saved, toggleSaved } = useApp();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [month, setMonth] = useState({ year: 2026, month: 9 });
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const savedEvents = useMemo(() => events.filter((event) => saved.includes(event.id)).sort((a, b) => a.startAt.localeCompare(b.startAt)), [saved]);
  if (!hydrated) return <PageShell><LoadingState label="Loading saved events" /></PageShell>;
  return <PageShell><div className="saved-wrap">
    <header className="page-header"><div><div className="discover-header-copy"><p className="eyebrow">Your shortlist</p><DemoPill /></div><h1>Saved plans</h1><p className="lede">Interesting, not registered. Open an event to find the organizer link when one is available.</p></div></header>
    {savedEvents.length === 0 ? <div className="empty-state"><div className="empty-icon"><BookmarkX size={28} /></div><h2>Nothing saved yet</h2><p>Swipe right on a plan or use the bookmark in grid view. Saving is private to this browser.</p><Link href="/discover" className="btn btn-primary">Discover events</Link></div> : <>
      <div className="saved-toolbar"><span className="saved-count">{savedEvents.length} {savedEvents.length === 1 ? "event" : "events"}</span><div className="view-toggle"><button className={view === "list" ? "btn btn-quiet active" : "btn btn-quiet"} onClick={() => setView("list")}><List size={16} /> List</button><button className={view === "calendar" ? "btn btn-quiet active" : "btn btn-quiet"} onClick={() => setView("calendar")}><CalendarDays size={16} /> Calendar</button></div></div>
      {view === "list" ? <div className="saved-list">{savedEvents.map((event) => <article className="saved-row" key={event.id}><div className="saved-thumb">{!failedImages.includes(event.id) && <Image src={event.image} alt="" width={280} height={212} onError={() => setFailedImages((current) => [...current, event.id])} />}</div><div><p className="eyebrow">{formatDate(event.startAt)} · {formatPrice(event.price)}</p><h3>{event.title}</h3><div className="card-meta"><span>{formatTime(event.startAt)}</span><span>{event.venue}</span></div></div><div className="saved-actions"><Link className="btn btn-quiet" href={`/events/${event.id}`}>Details</Link><button className="btn btn-danger" type="button" onClick={() => toggleSaved(event.id)} aria-label={`Remove ${event.title}`}><Trash2 size={16} /> Remove</button></div></article>)}</div> : <CalendarView events={savedEvents} month={month} setMonth={setMonth} />}
    </>}
  </div></PageShell>;
}

function CalendarView({ events: savedEvents, month, setMonth }: { events: typeof events; month: { year: number; month: number }; setMonth: (value: { year: number; month: number }) => void }) {
  const firstDay = new Date(Date.UTC(month.year, month.month, 1)).getUTCDay();
  const days = new Date(Date.UTC(month.year, month.month + 1, 0)).getUTCDate();
  const previous = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    if (index < firstDay) return { day: previous - firstDay + index + 1, offset: -1 };
    if (index >= firstDay + days) return { day: index - firstDay - days + 1, offset: 1 };
    return { day: index - firstDay + 1, offset: 0 };
  });
  const label = new Intl.DateTimeFormat("en-TW", { month: "long", year: "numeric", timeZone: "Asia/Taipei" }).format(new Date(Date.UTC(month.year, month.month, 1)));
  const move = (by: number) => { const next = new Date(Date.UTC(month.year, month.month + by, 1)); setMonth({ year: next.getUTCFullYear(), month: next.getUTCMonth() }); };
  return <div className="calendar-card"><div className="calendar-head"><button className="icon-btn" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><h2>{label}</h2><button className="icon-btn" onClick={() => move(1)} aria-label="Next month"><ChevronRight size={18} /></button></div><div className="calendar-grid">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}{cells.map((cell, index) => { const matching = cell.offset === 0 ? savedEvents.filter((event) => { const [year, mon, day] = event.startAt.slice(0, 10).split("-").map(Number); return year === month.year && mon === month.month + 1 && day === cell.day; }) : []; return <div className={cell.offset ? "calendar-day muted" : "calendar-day"} key={index}><span className="calendar-number">{cell.day}</span>{matching.map((event) => <Link className="calendar-event" href={`/events/${event.id}`} key={event.id}>{event.title}</Link>)}</div>; })}</div></div>;
}
