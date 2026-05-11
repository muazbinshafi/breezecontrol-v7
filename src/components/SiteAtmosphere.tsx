import { useEffect, useState } from "react";

/**
 * SiteAtmosphere — fixed, full-viewport cinematic background that lives
 * behind every route. Layered animated gradients + subtle film grain.
 * Pointer-events disabled so it never blocks interaction.
 *
 * Performance fallbacks:
 *   - Respects prefers-reduced-motion (renders a single static gradient).
 *   - Detects low-end devices (low CPU cores, low device memory, save-data,
 *     small viewport / coarse pointer) and renders a lighter version: no
 *     conic sweep, no animated grain, fewer blobs, no blur animation.
 */
export function SiteAtmosphere() {
  const [tier, setTier] = useState<"full" | "lite" | "static">("full");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reducedMotion) {
      setTier("static");
      document.documentElement.dataset.perf = "static";
      return;
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const saveData = nav.connection?.saveData === true;
    const slowNet = ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
    const lowEnd =
      cores <= 4 || memory <= 4 || saveData || slowNet || window.innerWidth < 640;

    const next = lowEnd ? "lite" : "full";
    setTier(next);
    document.documentElement.dataset.perf = next;
  }, []);

  if (tier === "static") {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-mesh"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="atmos-blob atmos-blob--a" />
      <div className="atmos-blob atmos-blob--b" />
      {tier === "full" && <div className="atmos-blob atmos-blob--c" />}
      {tier === "full" && <div className="atmos-sweep" />}
      {tier === "full" && <div className="atmos-grain" />}
      <div className="atmos-vignette" />
    </div>
  );
}
