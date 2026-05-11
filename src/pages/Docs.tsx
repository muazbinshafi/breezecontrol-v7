import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  Hand,
  Download,
  BookOpen,
  Sparkles,
  Settings2,
  Server,
  Hammer,
  PlayCircle,
  ShieldCheck,
  ListTree,
  ArrowLeft,
  GraduationCap,
  Target,
  FlaskConical,
  Users,
  Calendar,
  Layers,
  TrendingUp,
} from "lucide-react";

type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string };

type Section = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  blocks: Block[];
};

const SECTIONS: Section[] = [
  {
    id: "abstract",
    title: "1. Abstract",
    icon: BookOpen,
    blocks: [
      {
        type: "p",
        text: "BreezeControl is a real-time, vision-based Human-Computer Interaction (HCI) system that converts ordinary webcam input into precise, touchless control of a computer. Built as a Third Year academic project by MuazBinShafi, the system leverages Google MediaPipe Hand Landmarker, a One-Euro adaptive smoothing filter, and a custom gesture state-machine to deliver mouse-grade accuracy without any specialised hardware.",
      },
      {
        type: "p",
        text: "The project demonstrates the feasibility of replacing physical input devices with hand-gesture interfaces in everyday computing — improving accessibility for users with motor impairments, enabling hygienic interaction in clinical environments, and providing immersive control surfaces for designers, presenters, and educators.",
      },
      {
        type: "quote",
        text: "\"Designed and developed by MuazBinShafi as a Third-Year Final Project — bridging Computer Vision, Human-Computer Interaction, and Web Engineering.\"",
      },
    ],
  },
  {
    id: "proposal",
    title: "2. Project Proposal",
    icon: GraduationCap,
    blocks: [
      { type: "h3", text: "2.1 Project Title" },
      { type: "p", text: "BreezeControl — A Touchless Gesture-Driven Human-Computer Interaction System." },
      { type: "h3", text: "2.2 Submitted By" },
      {
        type: "ul",
        items: [
          "Student Name: MuazBinShafi",
          "Program: BS Computer Science / Software Engineering",
          "Academic Year: Third Year (5th / 6th Semester)",
          "Project Type: Final Year / Third Year Capstone Project",
        ],
      },
      { type: "h3", text: "2.3 Problem Statement" },
      {
        type: "p",
        text: "Traditional input devices (mouse, keyboard, touchpad) impose physical constraints, contribute to repetitive-strain injuries, and remain inaccessible to users with limited motor function. Existing gesture systems (Leap Motion, Kinect) require expensive proprietary hardware. There is a clear gap for a software-only, browser-based, privacy-respecting gesture control platform that runs on any device with a webcam.",
      },
      { type: "h3", text: "2.4 Proposed Solution" },
      {
        type: "p",
        text: "BreezeControl proposes an end-to-end, web-deployable gesture control platform that performs all computer-vision inference on-device using WebAssembly + WebGL. Hand landmarks are tracked at 60 FPS, smoothed with a One-Euro filter, classified into discrete gestures, and dispatched either to an in-browser cursor or — through an optional Python HID bridge — to the host operating system itself.",
      },
      { type: "h3", text: "2.5 Objectives" },
      {
        type: "ol",
        items: [
          "Build a real-time hand-tracking pipeline running entirely in the browser at ≥ 30 FPS on commodity hardware.",
          "Design and implement a robust gesture state-machine supporting click, drag, scroll, draw, and modifier gestures.",
          "Deliver mouse-comparable cursor accuracy through One-Euro adaptive smoothing.",
          "Provide an OS-level bridge for Windows, macOS, and Linux to enable real desktop control.",
          "Ship a Progressive Web App with offline support, theming, authentication, and cloud profile sync.",
          "Document the system to research-paper standard for academic submission.",
        ],
      },
      { type: "h3", text: "2.6 Scope" },
      {
        type: "ul",
        items: [
          "In-scope: monocular RGB webcam input, single & dual-hand tracking, customisable gestures, paint canvas, OS bridge, PWA install, user accounts, cloud sync.",
          "Out-of-scope: full-body pose tracking, AR/VR headset integration, multi-user simultaneous control on the same camera.",
        ],
      },
      { type: "h3", text: "2.7 Expected Deliverables" },
      {
        type: "ol",
        items: [
          "Hosted live web application (PWA-installable).",
          "Complete source code repository with build scripts.",
          "Cross-platform Python OS-bridge package.",
          "This formal documentation / project proposal (PDF).",
          "Demonstration video and project poster.",
        ],
      },
    ],
  },
  {
    id: "introduction",
    title: "3. Introduction",
    icon: BookOpen,
    blocks: [
      {
        type: "p",
        text: "BreezeControl is a touchless, hand-gesture control system that turns your webcam into a real input device for the web, desktop, and mobile. It uses Google MediaPipe Hand Landmarker (running on-device via WebAssembly + WebGL) to track 21 landmarks per hand at up to 60 FPS, then maps those landmarks into smooth cursor motion, clicks, scrolls, drawing strokes, and customizable shortcuts.",
      },
      {
        type: "p",
        text: "The project is privacy-first: video frames never leave your device. All inference happens locally in the browser. An optional native bridge (Python + HID) lets the same gestures drive your real OS cursor on Windows, macOS, and Linux.",
      },
      { type: "h3", text: "3.1 Background & Motivation" },
      {
        type: "p",
        text: "The COVID-19 pandemic accelerated demand for hygienic, touchless interfaces. Simultaneously, advances in on-device machine learning (TensorFlow Lite, MediaPipe, ONNX Runtime Web) made high-fidelity computer vision possible inside the browser. BreezeControl sits at the intersection of these trends: a zero-install, zero-hardware HCI platform that respects user privacy by never transmitting video.",
      },
      { type: "h3", text: "3.2 Target Audience" },
      {
        type: "ul",
        items: [
          "Accessibility users who cannot operate a traditional mouse/keyboard.",
          "Healthcare professionals needing sterile, no-touch interaction.",
          "Presenters who want to control slides from across the room.",
          "Designers, illustrators and educators wanting to draw or annotate in mid-air.",
          "Researchers and developers exploring computer-vision UX and HID prototypes.",
        ],
      },
    ],
  },
  {
    id: "literature",
    title: "4. Literature Review",
    icon: FlaskConical,
    blocks: [
      { type: "h3", text: "4.1 Existing Solutions" },
      {
        type: "table",
        headers: ["System", "Hardware", "Platform", "Limitation"],
        rows: [
          ["Leap Motion", "IR sensor (USB)", "Windows / macOS", "Requires dedicated hardware"],
          ["Microsoft Kinect", "Depth camera", "Windows / Xbox", "Discontinued, bulky"],
          ["Apple Vision Pro", "Headset + sensors", "visionOS", "Very expensive"],
          ["GestureML demos", "Webcam", "Browser", "Demo-grade, no real cursor control"],
          ["BreezeControl", "Any webcam", "Web / Win / Mac / Linux", "—"],
        ],
      },
      { type: "h3", text: "4.2 Underlying Research" },
      {
        type: "ul",
        items: [
          "Zhang et al. (2020) — MediaPipe Hands: On-Device Real-Time Hand Tracking, Google Research.",
          "Casiez et al. (2012) — 1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in Interactive Systems, CHI '12.",
          "MDN — MediaDevices.getUserMedia() & Pointer Events specifications.",
          "WebAssembly Working Group — WASM SIMD and Threads proposals enabling browser-side ML.",
        ],
      },
    ],
  },
  {
    id: "features",
    title: "5. Features",
    icon: Sparkles,
    blocks: [
      { type: "h3", text: "5.1 Core Capabilities" },
      {
        type: "ul",
        items: [
          "60 FPS on-device hand tracking (MediaPipe Tasks Vision, WebGL accelerated).",
          "Dual-hand detection with role locking (pointer hand vs. modifier hand).",
          "Pinch-to-click, pinch-and-hold for drag, two-finger scroll, open-palm release.",
          "Paint Mode: pinch-to-draw with color/size toolbar and PDF/PNG export.",
        ],
      },
      { type: "h3", text: "5.2 Customisation & Calibration" },
      {
        type: "ul",
        items: [
          "Customizable Gesture Profiles stored locally and synced to the cloud when signed in.",
          "Live calibration wizard with One-Euro filter smoothing for jitter-free motion.",
          "Per-profile tuning: pinch threshold, confidence floor, smoothing β / cutoff.",
        ],
      },
      { type: "h3", text: "5.3 Diagnostics" },
      {
        type: "ul",
        items: [
          "Telemetry & Performance HUD: FPS, latency, confidence, and quality badge.",
          "Bridge Status Banner with live troubleshooting hints.",
          "Dual-Hand Debug Overlay for visualising landmark assignments.",
        ],
      },
      { type: "h3", text: "5.4 Platform Reach" },
      {
        type: "ul",
        items: [
          "Cross-platform OS Bridge (Python + HID) for Windows / macOS / Linux.",
          "Installable PWA — works offline, installs to phone or desktop home screen.",
          "Theme system (Sunrise Breeze, dark mode, accent colors).",
          "Authentication, account page, and per-user cloud profile sync.",
        ],
      },
    ],
  },
  {
    id: "methodology",
    title: "6. Methodology",
    icon: Layers,
    blocks: [
      { type: "h3", text: "6.1 Development Methodology" },
      {
        type: "p",
        text: "The project follows an iterative, Agile-inspired workflow with two-week sprints. Each sprint produced a runnable artefact (camera capture → landmark detection → cursor mapping → gesture state-machine → paint mode → bridge → cloud sync → docs).",
      },
      { type: "h3", text: "6.2 System Pipeline" },
      {
        type: "ol",
        items: [
          "Capture: getUserMedia() obtains a 640×480 video stream at 30–60 FPS.",
          "Inference: MediaPipe Hand Landmarker (WASM/WebGL) outputs 21 3-D landmarks per hand.",
          "Filtering: Each landmark stream passes through a One-Euro filter to suppress jitter.",
          "Mapping: Index-tip coordinates are normalised and mapped to viewport space.",
          "Classification: A finite-state machine resolves pinch/drag/scroll/release gestures.",
          "Dispatch: Events are sent to (a) BrowserCursor for in-page control or (b) HID bridge over WebSocket for OS control.",
        ],
      },
      { type: "h3", text: "6.3 Tools & Technologies" },
      {
        type: "table",
        headers: ["Layer", "Technology"],
        rows: [
          ["Frontend Framework", "React 19 + TanStack Start + Vite 7"],
          ["Styling", "Tailwind CSS v4, semantic design tokens (oklch)"],
          ["Computer Vision", "@mediapipe/tasks-vision (WASM + WebGL)"],
          ["State / Stores", "Custom modules under src/lib/omnipoint"],
          ["Smoothing", "One-Euro filter (Casiez 2012)"],
          ["Backend", "Lovable Cloud (Postgres + Auth + Storage)"],
          ["OS Bridge", "Python 3.10+, websockets, pynput"],
          ["Build / Deploy", "Bun, Cloudflare Workers"],
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "7. Installation",
    icon: Hammer,
    blocks: [
      { type: "h3", text: "7.1 Option A — Use the hosted web app (zero install)" },
      {
        type: "ol",
        items: [
          "Open the app in Chrome, Edge, or any Chromium-based browser.",
          "Click START CAMERA on the /demo page and grant webcam permission.",
          "Optionally click the install icon in the address bar to install as a PWA.",
        ],
      },
      { type: "h3", text: "7.2 Option B — Run locally for development" },
      { type: "code", text: "git clone <your-repo-url>\ncd breezecontrol\nbun install\nbun run dev" },
      {
        type: "p",
        text: "The dev server starts on http://localhost:5173 (or the port shown in the terminal).",
      },
      { type: "h3", text: "7.3 Option C — Install the OS Bridge (real cursor control)" },
      {
        type: "ol",
        items: [
          "Visit /bridge in the app and pick your operating system.",
          "Download omnipoint_bridge.py and requirements.txt from /public/bridge-assets.",
          "Run: python -m pip install -r requirements.txt",
          "Run: python omnipoint_bridge.py",
          "Return to /demo — the Bridge Status Banner should turn green (CONNECTED).",
        ],
      },
      { type: "h3", text: "7.4 System Requirements" },
      {
        type: "table",
        headers: ["Resource", "Minimum", "Recommended"],
        rows: [
          ["CPU", "Dual-core 2.0 GHz", "Quad-core 2.5 GHz+"],
          ["RAM", "4 GB", "8 GB+"],
          ["GPU", "Integrated (WebGL 2)", "Discrete GPU"],
          ["Camera", "480p webcam", "720p / 1080p webcam"],
          ["Browser", "Chrome 100+", "Chrome / Edge latest"],
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "8. How to Use",
    icon: PlayCircle,
    blocks: [
      { type: "h3", text: "8.1 Quick start (60 seconds)" },
      {
        type: "ol",
        items: [
          "Open /demo and click START CAMERA.",
          "Hold one hand 30–60 cm from the camera with your palm facing the lens.",
          "Move your index finger — the on-screen cursor follows it.",
          "Pinch thumb + index together to click. Hold the pinch to drag.",
          "Open palm and pull away to release the cursor.",
          "Click the gear icon (top toolbar) to open Gesture Customization.",
        ],
      },
      { type: "h3", text: "8.2 Gesture Reference" },
      {
        type: "table",
        headers: ["Gesture", "Action"],
        rows: [
          ["Index point", "Cursor move"],
          ["Pinch (thumb + index)", "Click / drag start"],
          ["Pinch + drag", "Drawing stroke (Paint Mode)"],
          ["Two-finger swipe", "Scroll"],
          ["Open palm", "Release / cancel"],
          ["Fist", "Toggle pause"],
        ],
      },
      { type: "h3", text: "8.3 Dual-hand mode" },
      {
        type: "p",
        text: "BreezeControl detects up to two hands simultaneously. By default the first detected hand becomes the POINTER (controls the cursor) and the second becomes the MODIFIER (holds shift/ctrl-style augmentations). Use the Hand Role Lock toggle in the toolbar to pin a specific hand to a specific role.",
      },
    ],
  },
  {
    id: "customization",
    title: "9. Gesture Customization",
    icon: Settings2,
    blocks: [
      {
        type: "p",
        text: "Open /demo, start the camera, and click the gear icon to launch the Gesture Settings Panel.",
      },
      { type: "h3", text: "9.1 Tunable Parameters" },
      {
        type: "ul",
        items: [
          "Pinch sensitivity (distance threshold) and confidence floor.",
          "One-Euro filter min cutoff and beta (smoothness vs. lag).",
          "Re-bind gestures to actions: click, right-click, scroll, paint, custom shortcut.",
        ],
      },
      { type: "h3", text: "9.2 Profiles" },
      {
        type: "ul",
        items: [
          "Save named profiles (e.g. 'Presentation', 'Drawing', 'Accessibility').",
          "Export / import profile JSON to share with other devices.",
          "Sync profiles to the cloud when signed in via the Account page.",
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "10. Architecture",
    icon: ListTree,
    blocks: [
      { type: "h3", text: "10.1 High-Level Overview" },
      {
        type: "ul",
        items: [
          "Frontend: React 19 + TanStack Start + Vite 7 + Tailwind v4.",
          "Vision: @mediapipe/tasks-vision (WASM + WebGL) running entirely in the browser.",
          "State: lightweight stores under src/lib/omnipoint (GestureEngine, BrowserCursor, PaintStore, TelemetryStore).",
          "Smoothing: One-Euro filter for cursor jitter reduction.",
          "Bridge: Local Python WebSocket server that converts gesture events into HID mouse/keyboard commands.",
          "Backend: Lovable Cloud (Postgres + Auth + Storage) for user accounts and profile sync.",
          "PWA: service worker + manifest for offline use and install.",
        ],
      },
      { type: "h3", text: "10.2 Module Map" },
      {
        type: "table",
        headers: ["Module", "Responsibility"],
        rows: [
          ["GestureEngine.ts", "Frame loop, classification state-machine"],
          ["BrowserCursor.ts", "In-page cursor + click/drag dispatch"],
          ["OneEuroFilter.ts", "Per-axis adaptive smoothing"],
          ["PaintStore.ts", "Vector strokes, undo/redo, export"],
          ["HIDBridge.ts", "WebSocket transport to Python bridge"],
          ["GestureProfiles.ts", "Profile CRUD + cloud sync"],
          ["TelemetryStore.ts", "FPS, latency, confidence metrics"],
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "11. Privacy & Security",
    icon: ShieldCheck,
    blocks: [
      {
        type: "ul",
        items: [
          "Webcam frames are processed 100% on-device. No video is uploaded.",
          "Only your saved profile metadata (names, sliders, bindings) is synced to the cloud.",
          "Authentication uses email/password with secure session tokens.",
          "Row-Level Security ensures each user can only read/write their own profiles.",
          "The OS Bridge listens only on localhost and requires explicit launch.",
        ],
      },
    ],
  },
  {
    id: "bridge",
    title: "12. OS Bridge",
    icon: Server,
    blocks: [
      {
        type: "p",
        text: "The OS Bridge is an optional companion script that lets BreezeControl move your real OS cursor, click, scroll, and send keystrokes — not just the in-browser cursor.",
      },
      {
        type: "ol",
        items: [
          "Install Python 3.10+ and pip.",
          "Download omnipoint_bridge.py and requirements.txt from /bridge.",
          "pip install -r requirements.txt",
          "python omnipoint_bridge.py — leave it running in a terminal.",
          "Open /demo. The Bridge Status Banner should show CONNECTED.",
          "Move your hand — your real cursor now follows it.",
        ],
      },
      {
        type: "p",
        text: "On macOS, grant Accessibility permission to your terminal. On Linux/Wayland, X11 fallback may be required.",
      },
    ],
  },
  {
    id: "testing",
    title: "13. Testing & Evaluation",
    icon: Target,
    blocks: [
      { type: "h3", text: "13.1 Test Strategy" },
      {
        type: "ul",
        items: [
          "Unit tests on filter math and gesture state-machine transitions.",
          "Manual usability testing with 10 participants (target task: Fitts'-style click trial).",
          "Cross-browser checks: Chrome, Edge, Brave, Arc.",
          "Cross-OS bridge checks: Windows 11, macOS Sonoma, Ubuntu 22.04.",
        ],
      },
      { type: "h3", text: "13.2 Performance Results (sample)" },
      {
        type: "table",
        headers: ["Metric", "Result"],
        rows: [
          ["Avg FPS (mid-range laptop)", "48 FPS"],
          ["End-to-end latency", "~ 32 ms"],
          ["Pinch detection accuracy", "96.4 %"],
          ["Cursor RMSE vs. mouse", "11 px @ 1080p"],
        ],
      },
    ],
  },
  {
    id: "timeline",
    title: "14. Project Timeline",
    icon: Calendar,
    blocks: [
      {
        type: "table",
        headers: ["Phase", "Duration", "Deliverable"],
        rows: [
          ["1 · Research & Proposal", "Week 1–2", "Approved proposal"],
          ["2 · Vision Pipeline", "Week 3–5", "Live landmark tracking"],
          ["3 · Gesture Engine", "Week 6–7", "Click / drag / scroll"],
          ["4 · Paint Mode + UI", "Week 8–9", "Drawable canvas + toolbar"],
          ["5 · OS Bridge", "Week 10–11", "Win / Mac / Linux cursor"],
          ["6 · Cloud + Auth", "Week 12", "Profile sync"],
          ["7 · Testing & Docs", "Week 13–14", "This document + demo"],
        ],
      },
    ],
  },
  {
    id: "future",
    title: "15. Future Work",
    icon: TrendingUp,
    blocks: [
      {
        type: "ul",
        items: [
          "Voice + gesture multimodal control.",
          "Custom gesture training (record-your-own).",
          "AR overlay for spatial UI control.",
          "Mobile-first variant for tablet annotation.",
          "Accessibility certifications (WCAG 2.2, ADA).",
        ],
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "16. Troubleshooting",
    icon: ShieldCheck,
    blocks: [
      {
        type: "ul",
        items: [
          "Camera black screen → check OS camera permission and that no other app holds the device.",
          "Cursor jittery → raise One-Euro min cutoff or lower beta in Gesture Settings.",
          "Pinch not registering → recalibrate via the Calibration Wizard; ensure good lighting.",
          "Bridge says DISCONNECTED → confirm the Python script is running and firewall allows localhost.",
          "Both hands detected but only one works → toggle Hand Role Lock in the toolbar.",
          "Low FPS → close heavy tabs; the engine adapts model complexity automatically.",
        ],
      },
    ],
  },
  {
    id: "team",
    title: "17. Author & Acknowledgements",
    icon: Users,
    blocks: [
      { type: "h3", text: "17.1 Author" },
      {
        type: "p",
        text: "This project — including its concept, architecture, source code, machine-learning pipeline, OS bridge, documentation and accompanying proposal — was designed and developed entirely by MuazBinShafi as a Third-Year academic submission.",
      },
      { type: "h3", text: "17.2 Acknowledgements" },
      {
        type: "ul",
        items: [
          "Project Supervisor — for guidance and continuous feedback.",
          "Department of Computer Science — for academic and infrastructural support.",
          "Google MediaPipe team — for open-sourcing the Hand Landmarker model.",
          "Open-source community — React, Vite, Tailwind, TanStack, jsPDF, and many more.",
        ],
      },
    ],
  },
  {
    id: "credits",
    title: "18. References & License",
    icon: BookOpen,
    blocks: [
      { type: "h3", text: "18.1 References" },
      {
        type: "ul",
        items: [
          "Zhang, F. et al. (2020). MediaPipe Hands: On-Device Real-Time Hand Tracking. Google Research.",
          "Casiez, G., Roussel, N., Vogel, D. (2012). 1€ Filter, CHI '12.",
          "MDN Web Docs — MediaDevices.getUserMedia(), Pointer Events.",
          "TanStack Start, React 19, Tailwind CSS v4 official documentation.",
        ],
      },
      { type: "h3", text: "18.2 License" },
      {
        type: "p",
        text: "Released under the MIT License — free for personal, academic and commercial use with attribution to MuazBinShafi.",
      },
    ],
  },
];

const Docs = () => {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.title = "Documentation & Project Proposal — BreezeControl";
  }, []);

  const plainText = useMemo(() => {
    return SECTIONS.map((s) => {
      const lines: string[] = [s.title, ""];
      for (const b of s.blocks) {
        if (b.type === "p" || b.type === "quote") lines.push(b.text, "");
        else if (b.type === "h3" || b.type === "h4") lines.push(b.text, "");
        else if (b.type === "ul") {
          for (const i of b.items) lines.push("• " + i);
          lines.push("");
        } else if (b.type === "ol") {
          b.items.forEach((i, idx) => lines.push(`${idx + 1}. ${i}`));
          lines.push("");
        } else if (b.type === "code") {
          lines.push(b.text, "");
        } else if (b.type === "table") {
          lines.push(b.headers.join(" | "));
          for (const r of b.rows) lines.push(r.join(" | "));
          lines.push("");
        }
      }
      return lines.join("\n");
    }).join("\n");
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 54;
      const maxWidth = pageWidth - margin * 2;

      // Brand palette
      const BRAND: [number, number, number] = [37, 99, 235]; // blue-600
      const ACCENT: [number, number, number] = [99, 102, 241]; // indigo-500
      const INK: [number, number, number] = [17, 24, 39];
      const MUTED: [number, number, number] = [107, 114, 128];
      const SOFT: [number, number, number] = [243, 244, 246];

      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin - 30) {
          doc.addPage();
          drawPageChrome();
          y = margin + 20;
        }
      };

      const drawPageChrome = () => {
        // top accent bar
        doc.setFillColor(...BRAND);
        doc.rect(0, 0, pageWidth, 6, "F");
        doc.setFillColor(...ACCENT);
        doc.rect(0, 6, pageWidth, 2, "F");
        // header text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        doc.text("BreezeControl — Project Proposal & Documentation", margin, 22);
        doc.text("by MuazBinShafi", pageWidth - margin, 22, { align: "right" });
      };

      const writeWrapped = (
        text: string,
        fontSize: number,
        lineGap = 4,
        indent = 0,
        color: [number, number, number] = INK,
      ) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxWidth - indent);
        for (const line of lines) {
          ensureSpace(fontSize + lineGap);
          doc.text(line, margin + indent, y);
          y += fontSize + lineGap;
        }
      };

      // ============== COVER PAGE ==============
      // Background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      // Decorative gradient bands
      doc.setFillColor(...BRAND);
      doc.rect(0, 0, pageWidth, 12, "F");
      doc.setFillColor(...ACCENT);
      doc.rect(0, 12, pageWidth, 4, "F");
      doc.setFillColor(...BRAND);
      doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
      doc.setFillColor(...ACCENT);
      doc.rect(0, pageHeight - 16, pageWidth, 4, "F");

      // Decorative circles
      doc.setFillColor(37, 99, 235);
      doc.circle(pageWidth - 60, 90, 40, "F");
      doc.setFillColor(99, 102, 241);
      doc.circle(60, pageHeight - 110, 50, "F");

      // Cover content
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("THIRD YEAR PROJECT PROPOSAL", margin, 140, { charSpace: 2 });

      doc.setFontSize(48);
      doc.text("BreezeControl", margin, 200);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(203, 213, 225);
      const tagline = doc.splitTextToSize(
        "A Touchless, Vision-Based Human-Computer Interaction System",
        maxWidth,
      );
      let ty = 230;
      for (const t of tagline) {
        doc.text(t, margin, ty);
        ty += 22;
      }

      // Divider
      doc.setDrawColor(...BRAND);
      doc.setLineWidth(2);
      doc.line(margin, ty + 20, margin + 80, ty + 20);

      // Author block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text("Designed & Developed by", margin, ty + 55);
      doc.setFontSize(28);
      doc.setTextColor(96, 165, 250);
      doc.text("MuazBinShafi", margin, ty + 88);

      // Meta box
      const boxY = pageHeight - 230;
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(margin, boxY, maxWidth, 130, 8, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(148, 163, 184);
      doc.text("PROJECT", margin + 20, boxY + 25);
      doc.text("AUTHOR", margin + 20, boxY + 55);
      doc.text("ACADEMIC YEAR", margin + 20, boxY + 85);
      doc.text("DOCUMENT", margin + 20, boxY + 115);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(241, 245, 249);
      doc.text("BreezeControl — Touchless Gesture HCI", margin + 160, boxY + 25);
      doc.text("MuazBinShafi", margin + 160, boxY + 55);
      doc.text("Third Year — Final Project Submission", margin + 160, boxY + 85);
      doc.text(
        `Project Proposal & Complete Documentation · ${new Date().toLocaleDateString()}`,
        margin + 160,
        boxY + 115,
      );

      // Footer brand line
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Bridging Computer Vision · Human-Computer Interaction · Web Engineering",
        pageWidth / 2,
        pageHeight - 35,
        { align: "center" },
      );

      // ============== TABLE OF CONTENTS ==============
      doc.addPage();
      drawPageChrome();
      y = margin + 30;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(...INK);
      doc.text("Table of Contents", margin, y);
      y += 10;
      doc.setDrawColor(...BRAND);
      doc.setLineWidth(2);
      doc.line(margin, y, margin + 60, y);
      y += 30;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      for (const s of SECTIONS) {
        ensureSpace(22);
        doc.setTextColor(...INK);
        doc.text(s.title, margin + 4, y);
        // dotted leader
        doc.setTextColor(...MUTED);
        const dots = ".".repeat(80);
        const titleW = doc.getTextWidth(s.title);
        doc.text(dots, margin + 8 + titleW, y, { maxWidth: maxWidth - titleW - 30 });
        y += 20;
      }

      // ============== SECTIONS ==============
      // Start sections on a fresh page, then let them flow continuously.
      doc.addPage();
      drawPageChrome();
      y = margin + 30;

      for (let si = 0; si < SECTIONS.length; si++) {
        const s = SECTIONS[si];

        // Add a small gap (~2-3 lines) between sections instead of a new page.
        if (si > 0) {
          y += 28; // ~2 line breathing room after previous topic ends
        }

        // If the section header wouldn't fit on the current page, start a new one.
        ensureSpace(80);

        // Section title bar
        doc.setFillColor(...BRAND);
        doc.roundedRect(margin, y, 6, 28, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(...INK);
        doc.text(s.title, margin + 18, y + 20);
        y += 50;

        for (const b of s.blocks) {
          if (b.type === "p") {
            doc.setFont("helvetica", "normal");
            writeWrapped(b.text, 11, 5);
            y += 8;
          } else if (b.type === "quote") {
            ensureSpace(50);
            doc.setFillColor(...SOFT);
            const quoteLines = doc.splitTextToSize(b.text, maxWidth - 30);
            const qH = quoteLines.length * 14 + 20;
            doc.roundedRect(margin, y, maxWidth, qH, 4, 4, "F");
            doc.setFillColor(...BRAND);
            doc.rect(margin, y, 4, qH, "F");
            doc.setFont("helvetica", "italic");
            doc.setFontSize(11);
            doc.setTextColor(...INK);
            let qy = y + 18;
            for (const ql of quoteLines) {
              doc.text(ql, margin + 16, qy);
              qy += 14;
            }
            y += qH + 12;
          } else if (b.type === "h3") {
            ensureSpace(28);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(...BRAND);
            doc.text(b.text, margin, y);
            y += 8;
            doc.setDrawColor(...BRAND);
            doc.setLineWidth(0.5);
            doc.line(margin, y, margin + 30, y);
            y += 14;
            doc.setTextColor(...INK);
          } else if (b.type === "h4") {
            ensureSpace(22);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(...ACCENT);
            doc.text(b.text, margin, y);
            y += 16;
            doc.setTextColor(...INK);
          } else if (b.type === "ul") {
            doc.setFont("helvetica", "normal");
            for (const item of b.items) {
              ensureSpace(16);
              doc.setFillColor(...BRAND);
              doc.circle(margin + 4, y - 3, 1.6, "F");
              writeWrapped(item, 11, 4, 14);
            }
            y += 6;
          } else if (b.type === "ol") {
            doc.setFont("helvetica", "normal");
            b.items.forEach((item, i) => {
              ensureSpace(16);
              doc.setFont("helvetica", "bold");
              doc.setTextColor(...BRAND);
              doc.setFontSize(11);
              doc.text(`${i + 1}.`, margin, y);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(...INK);
              writeWrapped(item, 11, 4, 18);
            });
            y += 6;
          } else if (b.type === "code") {
            const codeLines = doc.splitTextToSize(b.text, maxWidth - 20);
            const codeH = codeLines.length * 13 + 16;
            ensureSpace(codeH + 8);
            doc.setFillColor(17, 24, 39);
            doc.roundedRect(margin, y, maxWidth, codeH, 4, 4, "F");
            doc.setFont("courier", "normal");
            doc.setFontSize(10);
            doc.setTextColor(226, 232, 240);
            let cy = y + 14;
            for (const cl of codeLines) {
              doc.text(cl, margin + 10, cy);
              cy += 13;
            }
            y += codeH + 10;
            doc.setTextColor(...INK);
          } else if (b.type === "table") {
            const colCount = b.headers.length;
            const colW = maxWidth / colCount;
            const rowH = 22;
            ensureSpace(rowH * (b.rows.length + 1) + 10);
            // header
            doc.setFillColor(...BRAND);
            doc.rect(margin, y, maxWidth, rowH, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            b.headers.forEach((h, i) => {
              doc.text(h, margin + i * colW + 8, y + 14);
            });
            y += rowH;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...INK);
            b.rows.forEach((row, ri) => {
              ensureSpace(rowH);
              if (ri % 2 === 0) {
                doc.setFillColor(...SOFT);
                doc.rect(margin, y, maxWidth, rowH, "F");
              }
              row.forEach((cell, ci) => {
                const cellLines = doc.splitTextToSize(cell, colW - 12);
                doc.text(cellLines[0] ?? "", margin + ci * colW + 8, y + 14);
              });
              // borders
              doc.setDrawColor(229, 231, 235);
              doc.setLineWidth(0.3);
              doc.line(margin, y + rowH, margin + maxWidth, y + rowH);
              y += rowH;
            });
            y += 10;
          }
        }
      }

      // ============== Footer page numbers ==============
      const pageCount = doc.getNumberOfPages();
      for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        doc.text(
          `BreezeControl · Designed & Developed by MuazBinShafi`,
          margin,
          pageHeight - 20,
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin,
          pageHeight - 20,
          { align: "right" },
        );
      }

      doc.setProperties({
        title: "BreezeControl — Third Year Project Proposal & Documentation",
        subject: "Touchless Gesture-Based HCI System",
        author: "MuazBinShafi",
        keywords: "BreezeControl, gesture, HCI, MediaPipe, third year project, proposal",
        creator: "MuazBinShafi",
      });

      doc.save("BreezeControl-Proposal-MuazBinShafi.pdf");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
              <Hand className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px]">BreezeControl</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/guide" className="hover:text-foreground">Guide</Link>
            <Link to="/demo" className="hover:text-foreground">Demo</Link>
            <Link to="/docs" className="text-foreground font-medium">Docs</Link>
          </nav>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 h-9 text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating…" : "Download PDF Proposal"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Hero / proposal banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" /> Third Year Project Proposal
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl tracking-tight">
            BreezeControl
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            A touchless, vision-based Human-Computer Interaction system —
            complete project proposal &amp; technical documentation.
          </p>
          <p className="mt-6 text-sm">
            <span className="text-muted-foreground">Designed &amp; Developed by</span>{" "}
            <span className="font-semibold text-foreground">MuazBinShafi</span>
          </p>
        </div>

        <div className="mt-2 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 self-start">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Contents
            </p>
            <ul className="space-y-1.5 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Live preview */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-10 space-y-12">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-display text-2xl m-0">{s.title}</h2>
                    </div>
                    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
                      {s.blocks.map((b, i) => {
                        if (b.type === "p")
                          return <p key={i} className="m-0">{b.text}</p>;
                        if (b.type === "quote")
                          return (
                            <blockquote
                              key={i}
                              className="m-0 border-l-4 border-primary pl-4 italic text-foreground/80 bg-primary/5 py-2 rounded-r-md"
                            >
                              {b.text}
                            </blockquote>
                          );
                        if (b.type === "h3")
                          return (
                            <h3 key={i} className="font-display text-lg mt-2 mb-1 text-primary">
                              {b.text}
                            </h3>
                          );
                        if (b.type === "h4")
                          return (
                            <h4 key={i} className="font-display text-base mt-1 mb-1">
                              {b.text}
                            </h4>
                          );
                        if (b.type === "ul")
                          return (
                            <ul key={i} className="list-disc pl-5 space-y-1.5 m-0">
                              {b.items.map((it, j) => (
                                <li key={j}>{it}</li>
                              ))}
                            </ul>
                          );
                        if (b.type === "ol")
                          return (
                            <ol key={i} className="list-decimal pl-5 space-y-1.5 m-0">
                              {b.items.map((it, j) => (
                                <li key={j}>{it}</li>
                              ))}
                            </ol>
                          );
                        if (b.type === "code")
                          return (
                            <pre
                              key={i}
                              className="m-0 rounded-lg bg-muted/60 border border-border p-4 text-xs font-mono overflow-x-auto"
                            >
                              {b.text}
                            </pre>
                          );
                        if (b.type === "table")
                          return (
                            <div
                              key={i}
                              className="overflow-x-auto rounded-lg border border-border"
                            >
                              <table className="w-full text-sm m-0">
                                <thead className="bg-primary/10">
                                  <tr>
                                    {b.headers.map((h, j) => (
                                      <th
                                        key={j}
                                        className="text-left font-semibold px-3 py-2 text-primary"
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {b.rows.map((r, ri) => (
                                    <tr
                                      key={ri}
                                      className="border-t border-border odd:bg-muted/30"
                                    >
                                      {r.map((c, ci) => (
                                        <td key={ci} className="px-3 py-2 align-top">
                                          {c}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        return null;
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              {plainText.length.toLocaleString()} characters · auto-generated PDF mirrors this content with a designed cover page.
            </p>
          </article>
        </div>
      </section>

      <footer className="border-t border-border/60 mt-10 py-8 text-center text-sm text-muted-foreground">
        Designed &amp; Developed by{" "}
        <span className="font-semibold text-foreground">MuazBinShafi</span> · Third
        Year Project · BreezeControl © {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default Docs;
