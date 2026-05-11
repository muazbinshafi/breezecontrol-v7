/**
 * SiteAtmosphere — fixed, full-viewport cinematic background that lives
 * behind every route. Layered animated gradients + subtle film grain.
 * Pointer-events disabled so it never blocks interaction.
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Drifting color blobs */}
      <div className="atmos-blob atmos-blob--a" />
      <div className="atmos-blob atmos-blob--b" />
      <div className="atmos-blob atmos-blob--c" />
      {/* Slow conic sweep */}
      <div className="atmos-sweep" />
      {/* Film grain */}
      <div className="atmos-grain" />
      {/* Vignette to frame the viewport */}
      <div className="atmos-vignette" />
    </div>
  );
}
