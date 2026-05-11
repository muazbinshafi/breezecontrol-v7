import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import ResetPassword from "@/pages/ResetPassword";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  pendingComponent: RouteSkeleton,
  head: () => ({ meta: [{ title: "Reset password — BreezeControl" }] }),
});
