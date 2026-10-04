"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock3, MapPin, X } from "lucide-react";
import type { EventRecord, Preferences } from "@/lib/types";
import { dateParts, distanceKm, formatPrice, formatTime, whyItFits } from "@/lib/format";

type Props = {
  event: EventRecord;
  preferences: Preferences;
  onSave: () => void;
  onSkip: () => void;
};

export function EventCard({ event, preferences, onSave, onSkip }: Props) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const date = dateParts(event.startAt);

  const decide = (direction: "left" | "right") => {
    setExiting(direction);
    window.setTimeout(direction === "right" ? onSave : onSkip, 180);
  };

  return <article
    className={`event-card${dragX ? " dragging" : ""}${exiting ? ` swipe-${exiting}` : ""}`}
    style={dragX && !exiting ? { transform: `translateX(${dragX}px) rotate(${dragX / 35}deg)` } : undefined}
    onPointerDown={(event) => { startX.current = event.clientX; currentX.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; currentX.current = event.clientX; const delta = currentX.current - startX.current; if (Math.abs(delta) > 8) setDragX(delta); }}
    onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (Math.abs(dragX) > 100) decide(dragX > 0 ? "right" : "left"); else setDragX(0); }}
    onPointerCancel={() => setDragX(0)}
  >
    <div className="card-media">
      {!imageFailed && <Image src={event.image} alt={event.imageAlt} fill sizes="(max-width: 760px) 100vw, 620px" priority onError={() => setImageFailed(true)} />}
      <div className="ticket-date" aria-label={`${date.month} ${date.day}`}><span>{date.month}</span><strong>{date.day}</strong></div>
      {dragX > 45 && <div className="swipe-verdict save">SAVE</div>}
      {dragX < -45 && <div className="swipe-verdict skip">SKIP</div>}
      <span className="card-distance">{distanceKm(event)} km · demo estimate</span>
    </div>
    <div className="card-body">
      <div className="card-kicker"><span>{event.category}</span><span>·</span><span>{formatPrice(event.price)}</span></div>
      <h2 className="card-title">{event.title}</h2>
      <div className="card-meta"><span><Clock3 size={13} />{formatTime(event.startAt)}</span><span><MapPin size={13} />{event.venue}</span></div>
      <div className="tag-row">{event.vibes.map((vibe) => <span className="tag" key={vibe}>{vibe}</span>)}</div>
      <p className="fit-note"><strong>Why this fits:</strong> {whyItFits(event, preferences)}</p>
    </div>
  </article>;
}

export function EventActions({ event, onSave, onSkip }: { event: EventRecord; onSave: () => void; onSkip: () => void }) {
  return <div className="swipe-actions">
    <button className="btn round-action skip" type="button" onClick={onSkip} aria-label={`Skip ${event.title}`}><X size={23} /></button>
    <Link className="btn btn-quiet" href={`/events/${event.id}`}>Details</Link>
    <button className="btn round-action save" type="button" onClick={onSave} aria-label={`Save ${event.title}`}><Bookmark size={22} /></button>
  </div>;
}
