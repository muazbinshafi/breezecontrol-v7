import { createFileRoute } from "@tanstack/react-router";
import Install from "@/pages/Install";

export const Route = createFileRoute("/install")({
  component: Install,
  head: () => ({
    meta: [
      { title: "Install on your phone — BreezeControl" },
      { name: "description", content: "Add BreezeControl to your iOS or Android home screen as a PWA." },
    ],
  }),
});
