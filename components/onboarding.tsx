"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { PreferencesForm } from "@/components/preferences-form";
import { LoadingState } from "@/components/ui";

export function Onboarding() {
  const router = useRouter();
  const { hydrated, preferences, setPreferences } = useApp();
  useEffect(() => {
    if (hydrated && preferences) router.replace("/discover");
  }, [hydrated, preferences, router]);
  if (!hydrated) return <LoadingState />;
  if (preferences) return <LoadingState label="Opening your plans" />;
  return <main className="onboarding-page">
    <section className="onboarding-art" aria-label="Taipei city scene">
      <div className="onboarding-logo"><span className="brand-mark">N</span><span>NextUp</span></div>
      <div className="onboarding-copy"><p className="eyebrow" style={{ color: "#ff9a72" }}>TAIPEI · DEMO</p><h1>Find your<br />next plan.</h1><p>Events that fit your interests, pace, and part of town—without pretending a save is a registration.</p></div>
      <span className="onboarding-photo-credit">Demo city imagery</span>
    </section>
    <section className="onboarding-panel"><PreferencesForm onboarding onSave={(value) => { setPreferences(value); router.push("/discover"); }} /></section>
  </main>;
}
