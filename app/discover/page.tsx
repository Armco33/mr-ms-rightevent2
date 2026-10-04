import { Suspense } from "react";
import { DiscoverClient } from "@/components/discover-client";
import { LoadingState } from "@/components/ui";

export default function DiscoverPage() {
  return <Suspense fallback={<LoadingState label="Loading discovery" />}><DiscoverClient /></Suspense>;
}
