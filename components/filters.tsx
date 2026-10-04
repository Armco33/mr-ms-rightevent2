"use client";

import { INTERESTS, VIBES } from "@/lib/types";

export type FiltersValue = { category: string; vibe: string; date: string; price: number; distance: number };

export function Filters({ value, onChange, open }: { value: FiltersValue; onChange: (value: FiltersValue) => void; open: boolean }) {
  return <aside className={`filters${open ? " open" : ""}`} aria-label="Event filters">
    <div className="filter-title"><h2>Filters</h2><button className="clear-link" onClick={() => onChange({ category: "", vibe: "", date: "all", price: 2000, distance: 20 })}>Clear all</button></div>
    <div className="filter-section"><p className="section-label">Category</p>{INTERESTS.map((item) => <label key={item}><input type="checkbox" checked={value.category === item} onChange={() => onChange({ ...value, category: value.category === item ? "" : item })} />{item}</label>)}</div>
    <div className="filter-section"><label className="field-label" htmlFor="date-filter">Date</label><select id="date-filter" className="select-field" value={value.date} onChange={(event) => onChange({ ...value, date: event.target.value })}><option value="all">Any date</option><option value="october">October</option><option value="november">November</option><option value="weekend">Weekends</option></select></div>
    <div className="filter-section"><label className="field-label" htmlFor="price-filter">Price · up to NT${value.price.toLocaleString("en-TW")}</label><input id="price-filter" className="range" type="range" min="0" max="2000" step="100" value={value.price} onChange={(event) => onChange({ ...value, price: Number(event.target.value) })} /></div>
    <div className="filter-section"><label className="field-label" htmlFor="distance-filter">Distance · up to {value.distance} km</label><input id="distance-filter" className="range" type="range" min="2" max="20" value={value.distance} onChange={(event) => onChange({ ...value, distance: Number(event.target.value) })} /><p className="filter-value">From Taipei Main Station (demo)</p></div>
    <div className="filter-section"><p className="section-label">Vibe</p>{VIBES.map((item) => <label key={item}><input type="checkbox" checked={value.vibe === item} onChange={() => onChange({ ...value, vibe: value.vibe === item ? "" : item })} />{item}</label>)}</div>
  </aside>;
}
