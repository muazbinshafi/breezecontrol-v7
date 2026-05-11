<div align="center">

# 🌬️ BreezeControl

**Touchless mouse & keyboard control for the web — and your whole OS.**

Real-time hand-tracking that turns any laptop webcam into a precision pointer.
Built on MediaPipe HandLandmarker, a 1€-filter cursor pipeline, and an
optional local HID bridge for system-wide control.

[![Live demo](https://img.shields.io/badge/demo-online-22c55e?style=for-the-badge)](https://breezecontrol-v4.lovable.app)
[![Built with Lovable](https://img.shields.io/badge/built%20with-Lovable-ff4d8d?style=for-the-badge)](https://lovable.dev)
![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1-ef4444?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-149eca?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

## ✨ Highlights

- **Sub-30ms inference** with MediaPipe Tasks (WebGPU when available, WASM fallback)
- **1€ filtered cursor** — silky at rest, snappy on flicks, no overshoot
- **13+ poses** out of the box: pinch, peace, fist, rock, phone-call, palm-back…
- **Dual-hand role lock** — one hand drives, the other clicks/scrolls
- **Full remap UI** — every gesture → any action, per-mode (pointer / draw)
- **Profiles + cloud sync** — save tunings, share via `?preset=…` links
- **Browser-only mode** for instant trial, **HID bridge** for real OS control
- **Paint mode** with undo/redo/crop, **PNG export**, telemetry CSV export

---

## 🚀 Quick start

### Web app (browser-only mode)

```bash
git clone https://github.com/<your-org>/breezecontrol.git
cd breezecontrol
bun install            # or npm / pnpm
bun run dev
```

Open **http://localhost:3000/demo** and grant camera access. That's it.

### Full OS control (optional bridge)

```bash
python -m pip install -r bridge/requirements.txt
python bridge/omnipoint_bridge.py
```

Switch the web app to **Bridge** mode and click **TEST BRIDGE**. See
[`bridge/README.md`](bridge/README.md) for platform notes.

---

## 🧠 How it works

```text
 ┌──────────┐  RGB frames  ┌──────────────┐  21 landmarks  ┌──────────────┐
 │ getUserMedia│ ───────► │ MediaPipe Hands │ ───────────► │ GestureEngine │
 └──────────┘              └──────────────┘                 │  + 1€ filter │
                                                            └──────┬───────┘
                                                                   │ packets
                                              ┌────────────────────┴───────┐
                                              ▼                            ▼
                                    ┌──────────────────┐       ┌────────────────────┐
                                    │ Browser cursor   │       │ ws://localhost:8765│
                                    │ (in-page overlay)│       │  → pyautogui → OS  │
                                    └──────────────────┘       └────────────────────┘
```

Key modules:

| Path                                   | Role                                                |
| -------------------------------------- | --------------------------------------------------- |
| `src/lib/omnipoint/GestureEngine.ts`   | MediaPipe loop, pose classifier, click/scroll FSM   |
| `src/lib/omnipoint/OneEuroFilter.ts`   | Adaptive cursor smoothing (Casiez et al.)           |
| `src/lib/omnipoint/HIDBridge.ts`       | WebSocket client + auto-reconnect + probe RTT       |
| `src/lib/omnipoint/GestureSettings.ts` | Persistable bindings, profiles, cloud sync          |
| `src/lib/omnipoint/TelemetryStore.ts`  | Lock-free reactive store via `useSyncExternalStore` |
| `bridge/omnipoint_bridge.py`           | Local HID bridge (move / click / scroll / hotkey)   |

---

## 🎮 Default bindings

| Pose                       | Pointer mode    | Draw mode |
| -------------------------- | --------------- | --------- |
| Index point                | Move cursor     | Hover     |
| Thumb + index pinch        | Left click      | Paint     |
| Thumb + index + middle     | Right click     | Eyedropper|
| Sustained pinch            | Drag            | Draw      |
| Index + middle vertical    | Scroll          | —         |
| Open palm                  | Idle / park     | Undo      |
| Thumbs up                  | Confirm         | Confirm   |
| Fist                       | **Emergency stop**            ||

All remappable from **Settings → Gesture customization**.

---

## 🛠️ Tech stack

- **TanStack Start v1** + Vite 7 + React 19 (SSR + edge-ready)
- **Tailwind CSS v4** with native `@theme` tokens (oklch palette)
- **shadcn/ui** + Radix primitives
- **Lovable Cloud** (Supabase) for auth, profile sync, telemetry
- **MediaPipe Tasks Vision** (HandLandmarker, GestureRecognizer)
- **Python 3.10+** for the local bridge (pyautogui, websockets)

---

## 📁 Project layout

```text
breezecontrol/
├── bridge/                # Local HID bridge (Python)
│   ├── omnipoint_bridge.py
│   ├── requirements.txt
│   └── README.md
├── src/
│   ├── components/omnipoint/   # Camera, calibration, panels, overlays
│   ├── lib/omnipoint/          # Engine, filters, stores, profiles
│   ├── pages/                  # Index, Demo, Docs, Bridge guides…
│   ├── routes/                 # TanStack Start file-based routes
│   └── styles.css              # Design tokens (oklch + gradients)
└── supabase/              # Cloud schema, RLS, edge functions
```

---

## 🔒 Privacy

- Camera frames **never leave the browser**. Inference runs on-device.
- The bridge listens on `localhost` only by default.
- Cloud sync stores gesture settings only — no video, no landmarks.

---

## 🤝 Contributing

PRs welcome! Good first issues:
- Linux/Wayland bridge support
- Per-app profile auto-switching
- WebGPU benchmark mode
- Foot-pedal modifier integration

---

<div align="center">

Built with ❤ by MuazBinShafi on [Lovable](https://lovable.dev)
</div>
