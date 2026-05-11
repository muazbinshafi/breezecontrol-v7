import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Auth from "@/pages/Auth";

export const Route = createFileRoute("/auth")({
  component: Auth,
  pendingComponent: RouteSkeleton,
  head: () => ({ meta: [{ title: "Sign in — BreezeControl" }] }),
});
