import Link from "next/link";
import { Map } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function NotFound() { return <PageShell><div className="empty-state"><div className="empty-icon"><Map size={28} /></div><h1 style={{ fontSize: 34, marginTop: 20 }}>Wrong turn</h1><p>There isn’t a page at this address, but there are plenty of plans nearby.</p><Link href="/discover" className="btn btn-primary">Back to Discover</Link></div></PageShell>; }
