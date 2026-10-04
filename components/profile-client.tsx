"use client";

import { useApp } from "@/components/app-provider";
import Link from "next/link";
import { PreferencesForm } from "@/components/preferences-form";
import { PageShell } from "@/components/page-shell";
import { DemoPill, LoadingState } from "@/components/ui";

export function ProfileClient() {
  const { hydrated, preferences, setPreferences } = useApp();
  if (!hydrated) return <PageShell><LoadingState label="Loading profile" /></PageShell>;
  if (!preferences) return <PageShell><div className="empty-state"><h2>Set up your demo profile</h2><p>Choose a few preferences before editing them here.</p><Link href="/" className="btn btn-primary">Start setup</Link></div></PageShell>;
  const initials = preferences.name.trim() ? preferences.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "NP";
  return <PageShell><div className="profile-wrap">
    <header className="page-header"><div><div className="discover-header-copy"><p className="eyebrow">Your settings</p><DemoPill /></div><h1>Profile</h1><p className="lede">Tune what you see. Everything stays in this browser.</p></div></header>
    <div className="profile-grid"><aside className="profile-card"><div className="avatar">{initials}</div><h2>{preferences.name || "Demo Explorer"}</h2><p>Demo profile · no account</p></aside><section className="settings-card"><p className="eyebrow">Discovery preferences</p><h2>Edit your profile</h2><PreferencesForm key={JSON.stringify(preferences)} initial={preferences} onSave={setPreferences} /></section></div>
  </div></PageShell>;
}
