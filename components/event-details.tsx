"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Building2, CalendarDays, Clock3, ExternalLink, MapPin, Ticket } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { PageShell } from "@/components/page-shell";
import { DemoPill, LoadingState } from "@/components/ui";
import type { EventRecord } from "@/lib/types";
import { formatLongDate, formatPrice, formatTime } from "@/lib/format";

export function EventDetails({ event }: { event: EventRecord }) {
  const { hydrated, saved, toggleSaved } = useApp();
  const [imageFailed, setImageFailed] = useState(false);
  if (!hydrated) return <PageShell><LoadingState label="Loading event" /></PageShell>;
  const isSaved = saved.includes(event.id);
  return <PageShell><div className="details-wrap">
    <Link href="/discover" className="back-link"><ArrowLeft size={16} /> Back to Discover</Link>
    <div className="details-hero">{!imageFailed && <Image src={event.image} alt={event.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 1120px" onError={() => setImageFailed(true)} />}<DemoPill /><a className="hero-caption" href={event.imageCreditUrl} target="_blank" rel="noreferrer">Photo via {event.imageCredit}</a></div>
    <div className="details-grid"><article><div className="details-title-row"><div><p className="eyebrow">{event.category} · {event.city}</p><h1>{event.title}</h1><div className="tag-row">{event.vibes.map((vibe) => <span className="tag" key={vibe}>{vibe}</span>)}</div></div></div><p className="details-copy">{event.description}</p>
      <div className="details-facts"><div className="fact"><CalendarDays size={20} /><div><strong>Date</strong><span>{formatLongDate(event.startAt)}</span></div></div><div className="fact"><Clock3 size={20} /><div><strong>Time</strong><span>{formatTime(event.startAt)}–{formatTime(event.endAt)} · Asia/Taipei</span></div></div><div className="fact"><MapPin size={20} /><div><strong>Venue</strong><span>{event.venue}<br />{event.address}</span></div></div><div className="fact"><Building2 size={20} /><div><strong>Organizer</strong><span>{event.organizer}</span></div></div></div>
    </article>
    <aside className="details-aside"><div className="details-price">{formatPrice(event.price)}</div><button type="button" className={isSaved ? "btn btn-secondary" : "btn btn-primary"} onClick={() => toggleSaved(event.id)}><Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />{isSaved ? "Saved — remove" : "Save event"}</button>{event.registrationUrl ? <a className="btn btn-quiet" href={event.registrationUrl} target="_blank" rel="noreferrer">Register with organizer <ExternalLink size={15} /></a> : <button className="btn btn-quiet" type="button" disabled><Ticket size={16} /> Registration unavailable</button>}<p className="registration-note">Saving does not register you. This fictional demo listing has no live organizer URL.</p><div className="organizer"><span>Presented by</span><strong>{event.organizer}</strong></div></aside>
    </div>
  </div></PageShell>;
}
