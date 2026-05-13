import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Auth from "@/pages/Auth";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/auth")({
  component: Auth,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Sign in — BreezeControl" },
      { name: "description", content: "Sign in or create your BreezeControl account to sync your gesture profiles across devices." },
      { property: "og:title", content: "Sign in — BreezeControl" },
      { property: "og:description", content: "Sync your gesture profiles across devices." },
      { property: "og:url", content: `${SITE}/auth` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/auth` }],
  }),
});
