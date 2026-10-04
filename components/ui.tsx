import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Getting things ready" }: { label?: string }) {
  return <div className="loading-state" role="status"><LoaderCircle className="spin" size={24} /><span>{label}…</span></div>;
}

export function DemoPill() {
  return <span className="demo-pill">Demo content</span>;
}
