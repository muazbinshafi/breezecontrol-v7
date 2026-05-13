import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Index from "@/pages/Index";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/")({
  component: Index,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "BreezeControl — Touchless gesture control for any computer" },
      {
        name: "description",
        content:
          "Control your cursor, scroll, click and draw with hand gestures using only a webcam. No special hardware. Works on Windows, macOS and Linux.",
      },
      { property: "og:title", content: "BreezeControl — Touchless gesture control" },
      { property: "og:description", content: "Control any computer with just your webcam and your hands." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "BreezeControl — Touchless gesture control" },
      { name: "twitter:description", content: "Control any computer with just your webcam and your hands." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
});
