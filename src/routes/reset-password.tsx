import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import ResetPassword from "@/pages/ResetPassword";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Reset password — BreezeControl" },
      { name: "description", content: "Reset your BreezeControl account password." },
      { property: "og:title", content: "Reset password — BreezeControl" },
      { property: "og:url", content: `${SITE}/reset-password` },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/reset-password` }],
  }),
});
