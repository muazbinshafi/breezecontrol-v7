import { createFileRoute } from "@tanstack/react-router";
import NotFound from "@/pages/NotFound";

export const Route = createFileRoute("/$")({
  component: NotFound,
  head: () => ({
    meta: [
      { title: "Page not found — BreezeControl" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
