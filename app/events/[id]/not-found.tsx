import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function NotFound() { return <PageShell><div className="empty-state"><div className="empty-icon"><CalendarX2 size={28} /></div><h1 style={{ fontSize: 34, marginTop: 20 }}>Event not found</h1><p>This demo event may have moved or the link is incomplete.</p><Link href="/discover" className="btn btn-primary">Discover events</Link></div></PageShell>; }
