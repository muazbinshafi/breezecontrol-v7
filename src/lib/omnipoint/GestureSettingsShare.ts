// Shareable preset URLs — encode/decode GestureSettings into a query string
// so users can share their tuned profile via a single link.
//
// Format: `?preset=<base64url(JSON.stringify(settings))>`. Base64url keeps
// the URL safe to share over chat/email without escaping.

import {
  defaultSettings,
  GestureSettingsStore,
  type GestureSettings,
} from "./GestureSettings";

const PARAM = "preset";

function toBase64Url(s: string): string {
  if (typeof window === "undefined") return "";
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  if (typeof window === "undefined") return "";
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + ((4 - (s.length % 4)) % 4), "=");
  return decodeURIComponent(escape(atob(padded)));
}

/** Encode current settings into a shareable absolute URL. */
export function buildShareUrl(settings: GestureSettings = GestureSettingsStore.get()): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, toBase64Url(JSON.stringify(settings)));
  return url.toString();
}

/** Read a preset from the current URL, if any, and apply it to the store. */
export function loadPresetFromUrl(): GestureSettings | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get(PARAM);
  if (!param) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(param)) as Partial<GestureSettings>;
    const merged: GestureSettings = {
      ...defaultSettings,
      ...parsed,
      bindings: { ...defaultSettings.bindings, ...(parsed.bindings ?? {}) },
    };
    GestureSettingsStore.patch(merged);
    return merged;
  } catch {
    return null;
  }
}

/** Copy current settings link to clipboard. Returns the URL on success. */
export async function copyShareUrlToClipboard(): Promise<string | null> {
  const url = buildShareUrl();
  if (!url) return null;
  try {
    await navigator.clipboard.writeText(url);
    return url;
  } catch {
    return null;
  }
}
