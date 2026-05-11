import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Demo from "@/pages/Demo";
import { CameraErrorBoundary } from "@/components/omnipoint/CameraErrorBoundary";

export const Route = createFileRoute("/demo")({
  component: () => (
    <CameraErrorBoundary>
      <Demo />
    </CameraErrorBoundary>
  ),
  head: () => ({
    meta: [
      { title: "Live demo — BreezeControl" },
      { name: "description", content: "Try gesture control live in your browser. Wave, pinch, point — no install needed." },
    ],
  }),
});
