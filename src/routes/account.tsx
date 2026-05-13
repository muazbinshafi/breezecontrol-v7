import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Account from "@/pages/Account";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/account")({
  component: () => (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  ),
  pendingComponent: RouteSkeleton,
  head: () => ({
    meta: [
      { title: "Account — BreezeControl" },
      { name: "description", content: "Manage your BreezeControl account, profiles and synced settings." },
      { property: "og:title", content: "Account — BreezeControl" },
      { property: "og:url", content: `${SITE}/account` },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/account` }],
  }),
});
