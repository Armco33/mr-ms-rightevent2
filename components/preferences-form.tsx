"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { DEFAULT_PREFERENCES, INTERESTS, VIBES, type Category, type Preferences, type Vibe } from "@/lib/types";

type Props = {
  initial?: Preferences;
  onboarding?: boolean;
  onSave: (value: Preferences) => void;
};

export function PreferencesForm({ initial = DEFAULT_PREFERENCES, onboarding = false, onSave }: Props) {
  const [values, setValues] = useState(initial);
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const totalSteps = 3;

  const toggleInterest = (item: Category) => setValues((current) => ({ ...current, interests: current.interests.includes(item) ? current.interests.filter((value) => value !== item) : [...current.interests, item] }));
  const toggleVibe = (item: Vibe) => setValues((current) => ({ ...current, vibes: current.vibes.includes(item) ? current.vibes.filter((value) => value !== item) : [...current.vibes, item] }));
  const submit = () => { onSave(values); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };

  const basics = <>
    {!onboarding && <div className="form-group"><label className="field-label" htmlFor="name">Display name</label><input id="name" className="text-field" value={values.name} placeholder="Your name" onChange={(event) => setValues({ ...values, name: event.target.value })} /></div>}
    <div className="form-group"><p className="section-label">What are you into?</p><div className="chip-grid">{INTERESTS.map((item) => <button type="button" key={item} aria-pressed={values.interests.includes(item)} className={values.interests.includes(item) ? "choice-chip selected" : "choice-chip"} onClick={() => toggleInterest(item)}>{item}</button>)}</div><p className="form-help">Pick as many as you like. You can change these anytime.</p></div>
  </>;

  const location = <>
    <div className="form-group"><label className="field-label" htmlFor="city">City</label><select id="city" className="select-field" value={values.city} onChange={(event) => setValues({ ...values, city: event.target.value })}><option>Taipei</option></select><p className="form-help">The demo dataset currently covers Taipei only.</p></div>
    <div className="form-group"><label className="field-label" htmlFor="distance">Maximum distance · {values.maxDistance} km</label><input id="distance" className="range" type="range" min="2" max="20" step="1" value={values.maxDistance} onChange={(event) => setValues({ ...values, maxDistance: Number(event.target.value) })} /><p className="form-help">Estimated from the fixed demo location: Taipei Main Station.</p></div>
  </>;

  const taste = <>
    <div className="form-group"><p className="section-label">Preferred vibe</p><div className="chip-grid">{VIBES.map((item) => <button type="button" key={item} aria-pressed={values.vibes.includes(item)} className={values.vibes.includes(item) ? "choice-chip selected" : "choice-chip"} onClick={() => toggleVibe(item)}>{item}</button>)}</div></div>
    <div className="form-group"><label className="field-label" htmlFor="budget">Maximum price · {values.freeOnly ? "Free only" : `NT$${values.maxPrice.toLocaleString("en-TW")}`}</label><div className="chip-grid" style={{ marginBottom: 12 }}><button type="button" className={values.freeOnly ? "choice-chip selected" : "choice-chip"} onClick={() => setValues({ ...values, freeOnly: !values.freeOnly })}>Free only</button></div><input id="budget" className="range" type="range" min="0" max="2000" step="100" disabled={values.freeOnly} value={values.maxPrice} onChange={(event) => setValues({ ...values, maxPrice: Number(event.target.value), freeOnly: false })} /></div>
  </>;

  if (!onboarding) return <div>{basics}{location}{taste}<div className="save-bar">{saved && <span className="save-confirm"><Check size={15} /> Saved locally</span>}<button type="button" className="btn btn-primary" onClick={submit}>Save preferences</button></div></div>;

  return <div className="onboarding-form">
    <div className="step-row"><div className="progress" aria-label={`Step ${step} of ${totalSteps}`}><span style={{ width: `${(step / totalSteps) * 100}%` }} /></div><span className="step-count">{String(step).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}</span></div>
    <p className="eyebrow">Make it yours</p>
    <h2>{step === 1 ? "What sounds like a good time?" : step === 2 ? "How far would you go?" : "Set the mood and budget."}</h2>
    {step === 1 ? basics : step === 2 ? location : taste}
    <div className="form-actions"><button type="button" className="btn btn-quiet" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}><ArrowLeft size={16} /> Back</button>{step < totalSteps ? <button type="button" className="btn btn-primary" onClick={() => setStep((current) => Math.min(totalSteps, current + 1))}>Continue <ArrowRight size={16} /></button> : <button type="button" className="btn btn-primary" onClick={submit}>Start exploring <ArrowRight size={16} /></button>}</div>
  </div>;
}
