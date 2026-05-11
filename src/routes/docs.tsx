import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Docs from "@/pages/Docs";

export const Route = createFileRoute("/docs")({
  component: Docs,
  pendingComponent: RouteSkeleton,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Docs — BreezeControl" },
      { name: "description", content: "Documentation: setup, calibration, gesture mapping and the OS bridge." },
    ],
  }),
});
