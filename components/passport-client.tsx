"use client";

import { Award, Coffee, Handshake, Stamp, TicketCheck } from "lucide-react";
import { useApp } from "@/components/app-provider";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DemoPill, LoadingState } from "@/components/ui";
import { events } from "@/lib/events";
import { formatDate } from "@/lib/format";

export function PassportClient() {
  const { hydrated, saved, checkins, demoCheckIn } = useApp();
  if (!hydrated) return <PageShell><LoadingState label="Opening passport" /></PageShell>;
  const attended = events.filter((event) => checkins.includes(event.id));
  const savedEvents = events.filter((event) => saved.includes(event.id));
  const badges = [
    { title: "First Event", description: "Check in to one demo event.", icon: TicketCheck, earned: attended.length >= 1, progress: `${Math.min(attended.length, 1)} / 1` },
    { title: "Coffee Explorer", description: "Check in to a coffee event.", icon: Coffee, earned: attended.some((event) => event.category === "Coffee"), progress: attended.some((event) => event.category === "Coffee") ? "1 / 1" : "0 / 1" },
    { title: "Workshop Regular", description: "Check in to two workshops.", icon: Award, earned: attended.filter((event) => event.category === "Workshops").length >= 2, progress: `${Math.min(attended.filter((event) => event.category === "Workshops").length, 2)} / 2` },
    { title: "Community Builder", description: "Check in to three social events.", icon: Handshake, earned: attended.filter((event) => event.vibes.includes("Social")).length >= 3, progress: `${Math.min(attended.filter((event) => event.vibes.includes("Social")).length, 3)} / 3` },
  ];
  return <PageShell><div className="passport-wrap">
    <header className="page-header"><div><div className="discover-header-copy"><p className="eyebrow">Your city story</p><DemoPill /></div><h1>Event passport</h1><p className="lede">Collect stamps by attending—not by saving.</p></div></header>
    <section className="passport-cover"><div><p className="eyebrow" style={{ color: "#8ed0ad" }}>CITY EXPLORER</p><h2>{attended.length} demo {attended.length === 1 ? "check-in" : "check-ins"}</h2><p>Issued locally on this device · Taipei edition</p></div><span className="passport-number">TPE–2026–DEMO</span></section>
    <section><p className="eyebrow">Badge desk</p><div className="badge-grid">{badges.map(({ title, description, icon: Icon, earned, progress }) => <article className={earned ? "badge-card" : "badge-card locked"} key={title}><div className="stamp"><Icon size={38} /></div><h3>{title}</h3><p>{description}</p><span className="status-label">{earned ? "Stamp earned" : progress}</span></article>)}</div></section>
    <section className="checkin-section"><p className="eyebrow">Prototype controls</p><h2>Demo check-in</h2><p><strong>Attendance verification is not implemented.</strong> These buttons only demonstrate badge progress and save the result in this browser. Saved events do not count until you use a demo check-in.</p>
      {savedEvents.length ? <div className="checkin-list">{savedEvents.map((event) => { const checked = checkins.includes(event.id); return <div className="checkin-row" key={event.id}><div><strong>{event.title}</strong><span>{formatDate(event.startAt)} · {event.category}</span></div><button type="button" className={checked ? "btn btn-quiet" : "btn btn-primary"} disabled={checked} onClick={() => demoCheckIn(event.id)}>{checked ? <><TicketCheck size={16} /> Demo checked in</> : <><Stamp size={16} /> Demo check-in</>}</button></div>; })}</div> : <div className="empty-state" style={{ minHeight: 260 }}><div className="empty-icon"><Stamp size={28} /></div><h2>Save an event first</h2><p>Saved events will appear here so you can demonstrate a check-in.</p><Link className="btn btn-primary" href="/discover">Discover events</Link></div>}
    </section>
  </div></PageShell>;
}
