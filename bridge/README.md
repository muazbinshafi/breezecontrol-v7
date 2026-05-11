# BreezeControl — Local HID Bridge

A tiny Python WebSocket server that lets the BreezeControl web app drive your
real **operating system** mouse and keyboard. Without it the app still works
in **browser-only** mode (the on-page cursor), but full OS control needs this
bridge running locally.

## Quick start

```bash
# 1. install dependencies (one-time)
python -m pip install -r bridge/requirements.txt

# 2. run it
python bridge/omnipoint_bridge.py
```

Then open the web app, choose **Bridge** mode, and click **TEST BRIDGE**.
You should see a green ✓ within ~200 ms.

## Options

```bash
python bridge/omnipoint_bridge.py --port 8765 --verbose
```

| Flag           | Default      | What it does                              |
| -------------- | ------------ | ----------------------------------------- |
| `--host`       | `localhost`  | Interface to bind. Use `0.0.0.0` for LAN. |
| `--port`       | `8765`       | WebSocket port the web app connects to.   |
| `--verbose`    | off          | Log every received packet.                |

## Platform notes

- **macOS** — On first run, grant **Accessibility** permission to your
  terminal/Python in *System Settings → Privacy & Security → Accessibility*.
- **Linux/Wayland** — `pyautogui` requires X11. Run under XWayland or use a
  Wayland-aware fork. Most distros work out of the box on X11.
- **Windows** — No extra setup. Run from a normal PowerShell or cmd window.

## Safety

The bridge ships with **emergency stop** support. A closed-fist gesture (or
the in-app red button) sends `{"type":"stop"}` which immediately freezes all
mouse/keyboard output until you re-arm. `pyautogui.FAILSAFE` is disabled
because the in-app stop is more reliable than slamming the cursor into a
corner.

## Protocol

Plain JSON over WebSocket. The web client speaks this dialect already; you
only need to run the bridge.

```jsonc
{ "type": "move",   "x": 0.42, "y": 0.71 }   // normalized 0..1 of screen
{ "type": "click",  "button": "left" }        // left | right | middle
{ "type": "down" }                            // start drag
{ "type": "up" }                              // end drag
{ "type": "scroll", "dy": 60 }                // pixels (positive = down)
{ "type": "key",    "keys": ["ctrl","z"] }    // hotkey
{ "type": "ping" }                            // → { "type":"pong" }
{ "type": "stop" } / { "type": "rearm" }
```
