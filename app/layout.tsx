import type { Metadata } from "next";
import { AppProvider } from "@/components/app-provider";
import "./globals.css";
import "./city-explorer.css";

export const metadata: Metadata = {
  title: { default: "NextUp — Find your next plan", template: "%s — NextUp" },
  description: "A demo event discovery experience for Taipei.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><AppProvider>{children}</AppProvider></body></html>;
}
