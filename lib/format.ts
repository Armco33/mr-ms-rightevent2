import type { EventRecord, Preferences } from "@/lib/types";

export const DEMO_LOCATION = { latitude: 25.0478, longitude: 121.5319, label: "Taipei Main Station" };

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-TW", { timeZone: "Asia/Taipei", weekday: "short", month: "short", day: "numeric" }).format(new Date(iso));
}

export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-TW", { timeZone: "Asia/Taipei", weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-TW", { timeZone: "Asia/Taipei", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso));
}

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `NT$${new Intl.NumberFormat("en-TW", { maximumFractionDigits: 0 }).format(price)}`;
}

export function dateParts(iso: string) {
  const pieces = new Intl.DateTimeFormat("en-TW", { timeZone: "Asia/Taipei", month: "short", day: "2-digit" }).formatToParts(new Date(iso));
  return {
    month: pieces.find((part) => part.type === "month")?.value.toUpperCase() ?? "",
    day: pieces.find((part) => part.type === "day")?.value ?? "",
  };
}

export function distanceKm(event: EventRecord) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(event.latitude - DEMO_LOCATION.latitude);
  const dLon = toRad(event.longitude - DEMO_LOCATION.longitude);
  const lat1 = toRad(DEMO_LOCATION.latitude);
  const lat2 = toRad(event.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function whyItFits(event: EventRecord, prefs: Preferences) {
  const reasons: string[] = [];
  if (prefs.interests.includes(event.category)) reasons.push(`matches your ${event.category.toLowerCase()} interest`);
  const vibe = event.vibes.find((item) => prefs.vibes.includes(item));
  if (vibe) reasons.push(`has a ${vibe.toLowerCase()} vibe`);
  if (event.price === 0) reasons.push("is free to join");
  else if (!prefs.freeOnly && event.price <= prefs.maxPrice) reasons.push("is within your budget");
  if (distanceKm(event) <= prefs.maxDistance) reasons.push("is inside your distance setting");
  return reasons.length ? `It ${reasons.slice(0, 2).join(" and ")}.` : "It adds something different to your current picks.";
}
