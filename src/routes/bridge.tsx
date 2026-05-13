import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import BridgeInstall from "@/pages/BridgeInstall";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/bridge")({
  component: BridgeInstall,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "OS Bridge — BreezeControl" },
      { name: "description", content: "Install the local Python bridge to drive your real OS cursor with hand gestures." },
      { property: "og:title", content: "OS Bridge — BreezeControl" },
      { property: "og:description", content: "Install the local bridge to control your OS cursor with gestures." },
      { property: "og:url", content: `${SITE}/bridge` },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: "OS Bridge — BreezeControl" },
      { name: "twitter:description", content: "Install the local bridge to control your OS cursor with gestures." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/bridge` }],
  }),
});
