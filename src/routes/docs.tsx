import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Docs from "@/pages/Docs";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/docs")({
  component: Docs,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Docs — BreezeControl" },
      { name: "description", content: "Documentation: setup, calibration, gesture mapping and the OS bridge for BreezeControl." },
      { property: "og:title", content: "Docs — BreezeControl" },
      { property: "og:description", content: "Setup, calibration, gesture mapping and the OS bridge." },
      { property: "og:url", content: `${SITE}/docs` },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: "Docs — BreezeControl" },
      { name: "twitter:description", content: "Setup, calibration, gesture mapping and the OS bridge." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/docs` }],
  }),
});
