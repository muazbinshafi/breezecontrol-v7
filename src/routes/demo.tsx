import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Demo from "@/pages/Demo";
import { CameraErrorBoundary } from "@/components/omnipoint/CameraErrorBoundary";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/demo")({
  component: () => (
    <CameraErrorBoundary>
      <Demo />
    </CameraErrorBoundary>
  ),
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Live demo — BreezeControl" },
      { name: "description", content: "Try gesture control live in your browser. Wave, pinch, point — no install needed." },
      { property: "og:title", content: "Live demo — BreezeControl" },
      { property: "og:description", content: "Try gesture control live in your browser. No install required." },
      { property: "og:url", content: `${SITE}/demo` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Live demo — BreezeControl" },
      { name: "twitter:description", content: "Try gesture control live in your browser." },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/demo` },
      // Open TCP/TLS to MediaPipe CDNs early so the ~10MB model + WASM start
      // streaming the moment the route mounts, not after JS evaluates.
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://storage.googleapis.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "dns-prefetch", href: "https://storage.googleapis.com" },
      // Preload the heaviest assets (vision WASM + hand landmark model) so
      // the browser starts the downloads at HTML parse time, in parallel with
      // React hydration and the camera permission prompt.
      {
        rel: "preload",
        as: "fetch",
        href: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        crossOrigin: "anonymous",
        fetchpriority: "high",
      },
      {
        rel: "preload",
        as: "fetch",
        href: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm/vision_wasm_internal.wasm",
        crossOrigin: "anonymous",
        fetchpriority: "high",
      },
    ],
  }),
});
