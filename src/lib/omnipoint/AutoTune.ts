// AutoTune — records live telemetry for a short window, computes p95
// cursor jitter and pinch-distance distribution, then proposes optimized
// engine config values. Pure analysis; the caller decides whether to apply.

import { TelemetryStore } from "./TelemetryStore";
import type { EngineConfig } from "./GestureEngine";

export interface AutoTuneResult {
  samples: number;
  durationMs: number;
  jitterPx: number;            // p95 frame-to-frame cursor delta (norm units)
  pinchMin: number;            // 5th percentile pinch distance (closed)
  pinchMax: number;            // 95th percentile pinch distance (open)
  recommended: Partial<EngineConfig>;
  notes: string[];
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))));
  return sorted[idx];
}

export async function runAutoTune(
  durationMs = 8000,
  onProgress?: (pct: number) => void,
): Promise<AutoTuneResult> {
  const start = performance.now();
  const cursorDeltas: number[] = [];
  const pinchSamples: number[] = [];
  let lastX: number | undefined;
  let lastY: number | undefined;
  let samples = 0;

  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = performance.now();
      const elapsed = t - start;
      if (elapsed >= durationMs) {
        resolve();
        return;
      }
      onProgress?.(Math.min(1, elapsed / durationMs));
      const tel = TelemetryStore.get();
      if (tel.handPresent && tel.cursorX !== undefined && tel.cursorY !== undefined) {
        if (lastX !== undefined && lastY !== undefined) {
          cursorDeltas.push(Math.hypot(tel.cursorX - lastX, tel.cursorY - lastY));
        }
        lastX = tel.cursorX;
        lastY = tel.cursorY;
        if (typeof tel.pinchDistance === "number" && tel.pinchDistance > 0) {
          pinchSamples.push(tel.pinchDistance);
        }
        samples++;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  cursorDeltas.sort((a, b) => a - b);
  pinchSamples.sort((a, b) => a - b);

  const jitter = quantile(cursorDeltas, 0.95);
  const pinchMin = quantile(pinchSamples, 0.05);
  const pinchMax = quantile(pinchSamples, 0.95);

  const notes: string[] = [];
  const rec: Partial<EngineConfig> = {};

  // Jitter → smoothing & dead-zone
  if (jitter > 0.012) {
    rec.smoothingAlpha = 1.6;
    rec.deadZone = 0.012;
    notes.push("High jitter detected — increased smoothing, enabled small radial dead-zone.");
  } else if (jitter > 0.006) {
    rec.smoothingAlpha = 2.0;
    rec.deadZone = 0.006;
    notes.push("Moderate jitter — gentle smoothing & micro dead-zone.");
  } else {
    rec.smoothingAlpha = 2.4;
    rec.deadZone = 0;
    notes.push("Hand is rock-steady — kept response snappy.");
  }

  // Pinch distribution → click thresholds
  if (pinchSamples.length > 30 && pinchMax > pinchMin + 0.15) {
    const click = Math.max(0.4, Math.min(0.8, pinchMin + (pinchMax - pinchMin) * 0.35));
    const release = Math.max(click + 0.08, Math.min(0.95, pinchMin + (pinchMax - pinchMin) * 0.6));
    rec.clickThreshold = +click.toFixed(2);
    rec.releaseThreshold = +release.toFixed(2);
    notes.push(`Pinch range [${pinchMin.toFixed(2)}–${pinchMax.toFixed(2)}] → click ${rec.clickThreshold}, release ${rec.releaseThreshold}.`);
  } else {
    notes.push("Not enough pinch variation observed — kept current click thresholds.");
  }

  return {
    samples,
    durationMs: performance.now() - start,
    jitterPx: jitter,
    pinchMin,
    pinchMax,
    recommended: rec,
    notes,
  };
}
