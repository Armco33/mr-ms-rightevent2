"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock3, MapPin } from "lucide-react";
import type { EventRecord } from "@/lib/types";
import { dateParts, distanceKm, formatPrice, formatTime } from "@/lib/format";

export function GridEventCard({ event, saved, onToggle }: { event: EventRecord; saved: boolean; onToggle: () => void }) {
  const date = dateParts(event.startAt);
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="grid-card">
    <div className="grid-image">
      {!imageFailed && <Image src={event.image} alt={event.imageAlt} fill sizes="(max-width: 1000px) 100vw, 420px" onError={() => setImageFailed(true)} />}
      <div className="ticket-date"><span>{date.month}</span><strong>{date.day}</strong></div>
      <button type="button" className="icon-btn grid-save" onClick={onToggle} aria-label={`${saved ? "Remove" : "Save"} ${event.title}`}><Bookmark size={18} fill={saved ? "currentColor" : "none"} /></button>
    </div>
    <div className="grid-card-body"><div className="card-kicker">{event.category} · {formatPrice(event.price)}</div><Link href={`/events/${event.id}`}><h3>{event.title}</h3></Link><div className="card-meta"><span><Clock3 size={13} />{formatTime(event.startAt)}</span><span><MapPin size={13} />{event.venue}</span><span>{distanceKm(event)} km</span></div></div>
  </article>;
}
