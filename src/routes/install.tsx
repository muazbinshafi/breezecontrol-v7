import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Install from "@/pages/Install";

export const Route = createFileRoute("/install")({
  component: Install,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Install on your phone — BreezeControl" },
      { name: "description", content: "Add BreezeControl to your iOS or Android home screen as a PWA." },
    ],
  }),
});
