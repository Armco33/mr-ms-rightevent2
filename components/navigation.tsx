"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, MapPinned, UserRound } from "lucide-react";

const links = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/passport", label: "Passport", icon: MapPinned },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <>
      <aside className="desktop-sidebar" aria-label="Primary navigation">
        <Link href="/discover" className="brand" aria-label="NextUp home">
          <span className="brand-mark">N</span>
          <span>NextUp</span>
        </Link>
        <p className="brand-tagline">Find your next plan.</p>
        <nav className="side-links">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/discover" && pathname.startsWith("/events/"));
            return <Link key={href} href={href} className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}><Icon size={19} strokeWidth={2} /><span>{label}</span>{active && <span className="nav-ticket" aria-hidden="true" />}</Link>;
          })}
        </nav>
        <div className="demo-note"><span>DEMO EDITION</span><p>Fictional events around Taipei.</p></div>
      </aside>
      <nav className="mobile-nav" aria-label="Primary navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/discover" && pathname.startsWith("/events/"));
          return <Link key={href} href={href} className={active ? "mobile-nav-link active" : "mobile-nav-link"} aria-current={active ? "page" : undefined}><Icon size={21} strokeWidth={active ? 2.5 : 2} /><span>{label}</span></Link>;
        })}
      </nav>
    </>
  );
}
