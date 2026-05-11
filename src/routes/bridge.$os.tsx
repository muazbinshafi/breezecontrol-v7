import { createFileRoute } from "@tanstack/react-router";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import BridgeGuideOS from "@/pages/BridgeGuideOS";

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
    return {
      meta: [
        { title: `Install BreezeControl bridge on ${pretty}` },
        {
          name: "description",
          content: `Step-by-step instructions to install and run the BreezeControl HID bridge on ${pretty}.`,
        },
      ],
    };
  },
});
