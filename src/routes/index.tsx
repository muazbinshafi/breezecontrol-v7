import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BreezeControl — Touchless gesture control for any computer" },
      {
        name: "description",
        content:
          "Control your cursor, scroll, click and draw with hand gestures using only a webcam. No special hardware. Works on Windows, macOS and Linux.",
      },
      { property: "og:title", content: "BreezeControl — Touchless gesture control" },
      {
        property: "og:description",
        content: "Control any computer with just your webcam and your hands.",
      },
    ],
  }),
});
