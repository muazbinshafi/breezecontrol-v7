import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import GestureGuide from "@/pages/GestureGuide";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/guide")({
  component: GestureGuide,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Gesture guide — BreezeControl" },
      { name: "description", content: "Visual reference for every BreezeControl gesture: pinch, point, scroll, drag and more." },
      { property: "og:title", content: "Gesture guide — BreezeControl" },
      { property: "og:description", content: "Visual reference for every BreezeControl gesture." },
      { property: "og:url", content: `${SITE}/guide` },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: "Gesture guide — BreezeControl" },
      { name: "twitter:description", content: "Visual reference for every BreezeControl gesture." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/guide` }],
  }),
});
