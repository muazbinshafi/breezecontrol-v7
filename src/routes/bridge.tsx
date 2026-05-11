import { createFileRoute } from "@tanstack/react-router";
import BridgeInstall from "@/pages/BridgeInstall";

export const Route = createFileRoute("/bridge")({
  component: BridgeInstall,
  head: () => ({
    meta: [
      { title: "OS Bridge — BreezeControl" },
      { name: "description", content: "Install the local Python bridge to drive your real OS cursor with hand gestures." },
    ],
  }),
});
