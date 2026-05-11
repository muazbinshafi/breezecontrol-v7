import { createFileRoute } from "@tanstack/react-router";
import GestureGuide from "@/pages/GestureGuide";

export const Route = createFileRoute("/guide")({
  component: GestureGuide,
  head: () => ({
    meta: [
      { title: "Gesture guide — BreezeControl" },
      { name: "description", content: "Visual reference for every BreezeControl gesture: pinch, point, scroll, drag and more." },
    ],
  }),
});
