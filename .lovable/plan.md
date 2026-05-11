## Goal

Make every part of BreezeControl actually work end-to-end, fix the routing/architecture issues causing runtime warnings, and ship a set of accuracy + UX upgrades so gesture control feels "next-level" smooth.

## What I found

- Hybrid router: TanStack Start mounts `App.tsx`, which then runs `react-router-dom v6` inside it. This causes the React error in your console: *"Cannot update a component (Transitioner) while rendering a different component (BrowserRouter)"* plus React Router future-flag warnings.
- Duplicate `<title>` and `og:*` tags in `__root.tsx` (BreezeControl meta + leftover "Lovable App" meta).
- Pages live in `src/pages/*` (legacy CRA layout) instead of TanStack `src/routes/*`.
- Solid feature surface already built: MediaPipe hand tracking, OneEuroFilter, BrowserCursor, Paint store + export, HID Bridge, Telemetry, Calibration wizard, Cloud profile sync, Auth, Account.
- Supabase wired with publishable keys and migrations present.

---

## Phase 1 — Fix the routing layer (root cause of the console error)

Migrate from `react-router-dom` to native TanStack file routes. New layout:

```
src/routes/
  __root.tsx                 // providers + shell + nav
  index.tsx                  // landing
  demo.tsx                   // /demo
  guide.tsx                  // /guide
  install.tsx                // /install
  docs.tsx                   // /docs
  bridge.tsx                 // /bridge
  bridge.$os.tsx             // /bridge/:os
  auth.tsx                   // /auth
  reset-password.tsx         // /reset-password
  _authenticated.tsx         // gate via supabase.auth.getUser
  _authenticated/account.tsx // /account
  $.tsx                      // 404
```

- Replace `Link/useNavigate/useParams` from `react-router-dom` with `@tanstack/react-router`.
- Delete `App.tsx`, the splat host, and `react-router-dom` from `package.json`.
- Move providers (`ThemeProvider`, `QueryClientProvider`, `TooltipProvider`, `AuthProvider`, Toasters, `useCloudProfileSync`) into `__root.tsx`.

## Phase 2 — Clean up SEO + meta

- Remove duplicate `<title>` and og tags from `__root.tsx`.
- Per-route `head()` with unique title/description/og for `/demo`, `/guide`, `/docs`, `/install`, `/bridge`.
- Add canonical link per route.

## Phase 3 — Auth + data verification

- `/auth` sign-in / sign-up / Google OAuth round-trip.
- `/reset-password` honors `type=recovery` hash and calls `supabase.auth.updateUser`.
- `_authenticated` gate uses `supabase.auth.getUser()` in `beforeLoad` (per integration rules).
- Run Supabase security scan; fix any RLS gaps on profile / cloud sync tables.

## Phase 4 — Functional sweep (every page, every feature)

I will walk each route in the live preview and verify:
- **Index**: hero, CTAs, theme toggle, nav links.
- **Demo**: camera permission, MediaPipe model load, DetectionHUD, PinchConfidenceOverlay, DualHandDebugOverlay, PerformanceHUD, ControlModeBar, PaintToolbar (draw/undo/redo/save PNG/crop/commit), CalibrationWizard, LiveCalibrationPanel, SensorPanel, TelemetryPanel, GestureTour, HandRoleLockToggle.
- **GestureGuide**: every preview animation runs.
- **Install / Bridge / BridgeGuideOS**: per-OS instructions, copy-to-clipboard, BridgeStatusBanner + BridgeLogPanel + BridgeTroubleshooter when bridge is offline.
- **Docs**: anchors and nav.
- **Account**: profile load, sign-out, settings persist via cloud sync.
- **404**: catch-all.

Fix every broken import, missing asset, or runtime error found.

---

## Phase 5 — Accuracy upgrades (the "next level" part)

Concrete code changes to the gesture pipeline:

1. **Per-signal One-Euro tuning** — separate `minCutoff/beta` for cursor xy, pinch distance, and depth. Cursor: high beta (responsive). Pinch: low beta (stable). Expose sliders in `GestureSettingsPanel`.
2. **Pinch hysteresis + dwell** — `enterThreshold` < `exitThreshold`, plus N ms dwell before firing `down`. Kills click flicker.
3. **Confidence gating** — drop frames when `handedness.score < 0.6` or landmark visibility low.
4. **Hand-role lock** — keep dominant-hand assignment for 500 ms after loss; prevents L/R swap during occlusion.
5. **Adaptive smoothing by FPS** — scale `dCutoff` by measured frame interval so behavior is identical at 30/60 FPS.
6. **Z-depth normalization** — normalize landmark z by wrist→middle-MCP distance so pinch threshold is invariant to camera distance.
7. **5-point calibration** — corners + center instead of 2-point; store homography per user via cloud sync; auto-recalibrate when reprojection error is high.
8. **Frame budget guard** — if inference > 25 ms, skip alternate frames and interpolate cursor with the filter (keeps cursor smooth under load).
9. **Per-gesture cooldowns** — refractory period on swipe/pinch to stop double-fire.
10. **Quality telemetry** — false-positive/negative counters surfaced in `TelemetryQualityBadge` + CSV export for tuning.
11. **Kalman option** for pointer position as an alternative to OneEuro (toggle in settings, A/B compare).
12. **WASM SIMD + GPU delegate** — initialize MediaPipe with `delegate: "GPU"` and SIMD when available; large FPS win on supported browsers.

## Phase 6 — Website improvements & polish

- **Onboarding flow**: first-visit tour with camera test → calibration → first gesture, persisted in `localStorage`.
- **Camera setup check**: detect low light, low FPS, low resolution, multiple cameras; surface fixes in `CameraSetupCheck`.
- **Keyboard fallbacks** for everything in the demo so testing without a camera is possible.
- **Accessibility**: respect `prefers-reduced-motion`, ARIA labels on overlays, focus rings, color-contrast audit.
- **Design-token audit**: replace hard-coded `bg-white`/`text-black`/hex with `src/styles.css` tokens (you asked for "perfect" — this matters for theming).
- **Error boundaries** around the camera/MediaPipe pipeline so a model load failure doesn't blank the page.
- **Lazy-load** MediaPipe + jspdf only on `/demo` (smaller initial bundle).
- **Code-split** heavy panels with `React.lazy`.
- **PWA polish**: precache MediaPipe model assets; add offline fallback for `/demo`.
- **i18n scaffold** with `react-i18next` (English first; structure ready).
- **Analytics** (privacy-friendly): basic page + gesture-event counters wired into TelemetryStore.
- **Shareable preset URLs**: encode `GestureSettings` into a query string so users can share calibrated profiles.
- **Demo recordings**: record-to-WebM the camera + cursor overlay to share bug repros (uses MediaRecorder, stays client-side).
- **Help-in-place tooltips** on every HUD element.

## Phase 7 — Verification

- Run lint and a clean build.
- Walk the route matrix again, capture console + network, confirm zero React/router warnings.
- Run security scan; confirm clean.
- Report a final pass/fail checklist.

---

## Out of scope unless you ask

- Building the desktop HID bridge binary itself.
- Adding brand-new gestures beyond the existing set.
- Switching backends away from Lovable Cloud.

## Suggested split (because this is large)

- **Milestone A**: Phases 1–4 (everything works, console clean).
- **Milestone B**: Phase 5 accuracy upgrades.
- **Milestone C**: Phase 6 polish + nice-to-haves.

Tell me if you want all three milestones in one go, or just A first.
