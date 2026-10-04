import { Navigation } from "@/components/navigation";

export function PageShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className="app-frame"><Navigation /><main className={`page-content ${className}`}>{children}</main></div>;
}
