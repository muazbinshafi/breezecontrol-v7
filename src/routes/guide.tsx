import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import GestureGuide from "@/pages/GestureGuide";

export const Route = createFileRoute("/guide")({
  component: GestureGuide,
  pendingComponent: RouteSkeleton,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Gesture guide — BreezeControl" },
      { name: "description", content: "Visual reference for every BreezeControl gesture: pinch, point, scroll, drag and more." },
    ],
  }),
});
