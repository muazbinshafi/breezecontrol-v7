"""
BreezeControl HID Bridge
========================

Local WebSocket server that receives gesture packets from the BreezeControl
web app and drives the operating system's mouse/keyboard.

  • Runs on http://localhost:8765 (override with --port)
  • Echoes a small "hello" frame on connect so the web app can verify it
  • Translates JSON packets into pyautogui calls (move, click, scroll, keys)
  • Emergency-stop and re-arm packets are honored immediately

Install once
------------
    python -m pip install --upgrade pip
    python -m pip install -r bridge/requirements.txt

Run
---
    python bridge/omnipoint_bridge.py
    # then open the web app and click "TEST BRIDGE"

Packet shape (sent by the web client)
-------------------------------------
    { "type": "move",         "x": 0.42, "y": 0.71 }       # normalized 0..1
    { "type": "click",        "button": "left" }            # left | right | middle
    { "type": "down" } / { "type": "up" }                   # for drag
    { "type": "scroll",       "dy": 60 }                    # pixels
    { "type": "key",          "keys": ["ctrl","z"] }        # hotkey
    { "type": "stop" } / { "type": "rearm" }
    { "type": "ping" }                                      # → { "type":"pong" }

The web app already speaks this protocol; you only need to run this file.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from typing import Any

try:
    import pyautogui
    import websockets
except ImportError as exc:  # pragma: no cover
    sys.stderr.write(
        "\n[bridge] Missing dependency: %s\n"
        "         Install with:  python -m pip install -r bridge/requirements.txt\n\n"
        % exc.name
    )
    sys.exit(1)

pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0  # we control timing on the web side

log = logging.getLogger("breezecontrol.bridge")

SCREEN_W, SCREEN_H = pyautogui.size()
ARMED = True


def handle_packet(pkt: dict[str, Any]) -> dict[str, Any] | None:
    """Apply a single packet. Returns an optional reply frame."""
    global ARMED
    t = pkt.get("type")

    if t == "ping":
        return {"type": "pong", "screen": [SCREEN_W, SCREEN_H], "armed": ARMED}

    if t == "stop":
        ARMED = False
        log.warning("emergency stop")
        return {"type": "ack", "armed": False}

    if t == "rearm":
        ARMED = True
        log.info("re-armed")
        return {"type": "ack", "armed": True}

    if not ARMED:
        return None

    if t == "move":
        x = float(pkt.get("x", 0)) * SCREEN_W
        y = float(pkt.get("y", 0)) * SCREEN_H
        pyautogui.moveTo(x, y, _pause=False)
    elif t == "click":
        pyautogui.click(button=str(pkt.get("button", "left")), _pause=False)
    elif t == "down":
        pyautogui.mouseDown(button=str(pkt.get("button", "left")), _pause=False)
    elif t == "up":
        pyautogui.mouseUp(button=str(pkt.get("button", "left")), _pause=False)
    elif t == "scroll":
        pyautogui.scroll(int(pkt.get("dy", 0)), _pause=False)
    elif t == "key":
        keys = pkt.get("keys") or []
        if isinstance(keys, list) and keys:
            pyautogui.hotkey(*[str(k) for k in keys], _pause=False)
    else:
        log.debug("ignored packet: %r", t)
    return None


async def serve(websocket):
    log.info("client connected from %s", websocket.remote_address)
    await websocket.send(
        json.dumps({"type": "hello", "service": "breezecontrol-bridge", "version": 1})
    )
    try:
        async for raw in websocket:
            try:
                pkt = json.loads(raw)
            except json.JSONDecodeError:
                continue
            reply = handle_packet(pkt)
            if reply is not None:
                await websocket.send(json.dumps(reply))
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        log.info("client disconnected")


async def main_async(host: str, port: int) -> None:
    log.info("BreezeControl bridge listening on ws://%s:%d  (screen %dx%d)",
             host, port, SCREEN_W, SCREEN_H)
    log.info("Press Ctrl+C to quit.")
    async with websockets.serve(serve, host, port, max_size=1 << 16):
        await asyncio.Future()


def main() -> None:
    parser = argparse.ArgumentParser(description="BreezeControl local HID bridge")
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s  %(levelname)-7s  %(message)s",
        datefmt="%H:%M:%S",
    )
    try:
        asyncio.run(main_async(args.host, args.port))
    except KeyboardInterrupt:
        print("\n[bridge] bye")


if __name__ == "__main__":
    main()
