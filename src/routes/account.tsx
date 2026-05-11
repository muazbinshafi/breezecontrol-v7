import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import Account from "@/pages/Account";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/account")({
  component: () => (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ title: "Account — BreezeControl" }] }),
});
