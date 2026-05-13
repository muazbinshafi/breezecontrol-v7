import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Install from "@/pages/Install";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/install")({
  component: Install,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Install on your phone — BreezeControl" },
      { name: "description", content: "Add BreezeControl to your iOS or Android home screen as a PWA." },
      { property: "og:title", content: "Install BreezeControl on your phone" },
      { property: "og:description", content: "Add BreezeControl to your home screen as a PWA." },
      { property: "og:url", content: `${SITE}/install` },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: "Install BreezeControl on your phone" },
      { name: "twitter:description", content: "Add BreezeControl to your home screen as a PWA." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/install` }],
  }),
});
