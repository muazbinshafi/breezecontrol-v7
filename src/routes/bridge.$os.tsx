import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import BridgeGuideOS from "@/pages/BridgeGuideOS";

const SITE = "https://breezecontrol-v7.lovable.app";

export const Route = createFileRoute("/bridge/$os")({
  component: BridgeGuideOS,
  pendingComponent: RouteSkeleton,
  head: ({ params }) => {
    const os = params.os ?? "";
    const pretty =
      os.toLowerCase() === "windows"
        ? "Windows"
        : os.toLowerCase() === "macos" || os.toLowerCase() === "mac"
          ? "macOS"
          : os.toLowerCase() === "linux"
            ? "Linux"
            : os;
    const title = `Install BreezeControl bridge on ${pretty}`;
    const desc = `Step-by-step instructions to install and run the BreezeControl HID bridge on ${pretty}.`;
    const url = `${SITE}/bridge/${os}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});
