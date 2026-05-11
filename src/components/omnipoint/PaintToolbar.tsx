// PaintToolbar — MS Paint–style floating toolbox shown while the cursor is in
// "draw" mode. Mutates the shared PaintStore; BrowserCursor reads from it on
// every frame so changes apply instantly to the next stroke.

import { PaintStore, type PenTool, type ShapeTool, type Tool } from "@/lib/omnipoint/PaintStore";
import { usePaint, usePaintHistory } from "@/hooks/usePaint";
import { exportPng, exportPdf, sharePng } from "@/lib/omnipoint/PaintExport";

interface Props {
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCrop: () => void;
  onTogglePinchOverlay: () => void;
  pinchOverlayOn: boolean;
  getCanvas: () => HTMLCanvasElement | null;
}

const SWATCHES = [
  "#000000", "#ffffff", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#3b82f6",
  "#6366f1", "#a855f7", "#ec4899", "#78716c",
];

const SIZE_PRESETS = [2, 4, 8, 16, 28];

const PEN_TOOLS: { id: PenTool; label: string; icon: string }[] = [
  { id: "pen",         label: "Pen",         icon: "✎" },
  { id: "marker",      label: "Marker",      icon: "▰" },
  { id: "highlighter", label: "Highlighter", icon: "▤" },
  { id: "eraser",      label: "Eraser",      icon: "⌫" },
];

const SHAPE_TOOLS: { id: ShapeTool; label: string; icon: string }[] = [
  { id: "line",    label: "Line",    icon: "╱" },
  { id: "rect",    label: "Rect",    icon: "▭" },
  { id: "ellipse", label: "Ellipse", icon: "◯" },
  { id: "arrow",   label: "Arrow",   icon: "➜" },
];

const FILL_TOOLS: { id: "fill"; label: string; icon: string }[] = [
  { id: "fill", label: "Fill bucket", icon: "🪣" },
];

const SPECIAL_TOOLS: { id: "picker" | "spray" | "text" | "select" | "polygon" | "curve"; label: string; icon: string }[] = [
  { id: "picker",  label: "Color picker (eyedropper)", icon: "💧" },
  { id: "spray",   label: "Spray / airbrush",          icon: "✺" },
  { id: "text",    label: "Text (type on keyboard)",   icon: "T" },
  { id: "select",  label: "Select & move",             icon: "▢" },
  { id: "polygon", label: "Polygon (double-pinch closes)", icon: "◇" },
  { id: "curve",   label: "Curve (3-point bezier)",    icon: "ᔕ" },
];

export function PaintToolbar({
  onClear, onUndo, onRedo, onSave, onCrop,
  onTogglePinchOverlay, pinchOverlayOn, getCanvas,
}: Props) {
  const paint = usePaint();
  const history = usePaintHistory();

  const setTool = (tool: Tool) => PaintStore.set({ tool });
  const setColor = (color: string) => PaintStore.set({ color });
  const setSize = (size: number) => PaintStore.set({ size });
  const setSprayDensity = (sprayDensity: number) => PaintStore.set({ sprayDensity });
  const setFontSize = (fontSize: number) => PaintStore.set({ fontSize });

  const handleExportPng = () => { const c = getCanvas(); if (c) exportPng(c); };
  const handleExportPdf = () => { const c = getCanvas(); if (c) exportPdf(c); };
  const handleShare = () => { const c = getCanvas(); if (c) void sharePng(c); };

  return (
    <aside
      className="fixed left-3 top-1/2 -translate-y-1/2 z-50 panel-glass glow-border animate-fade-in
                 px-2 py-3 flex flex-col items-stretch gap-3 w-[78px]
                 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden"
      aria-label="Drawing toolbar"
    >
      <Group label="COLOR">
        <div className="grid grid-cols-3 gap-1.5 px-0.5">
          {SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              title={c}
              className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 active:scale-95 ${
                paint.color.toLowerCase() === c.toLowerCase()
                  ? "border-foreground ring-2 ring-primary/50 shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                  : "border-border/60"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <label className="mt-1 cursor-pointer relative w-full h-7 rounded-md border border-border/60 overflow-hidden hover:border-primary/60 transition-colors">
          <input
            type="color"
            value={paint.color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            title="Custom color"
          />
          <span
            className="absolute inset-0 grid place-items-center text-[10px] font-mono pointer-events-none"
            style={{ backgroundColor: paint.color, color: contrastText(paint.color) }}
          >
            CUSTOM
          </span>
        </label>
      </Group>

      <Divider />

      <Group label="PENS">
        {PEN_TOOLS.map((t) => (
          <ToolBtn key={t.id} active={paint.tool === t.id} onClick={() => setTool(t.id)} title={t.label}>
            <span className="text-base leading-none">{t.icon}</span>
          </ToolBtn>
        ))}
      </Group>

      <Divider />

      <Group label="SHAPES">
        {SHAPE_TOOLS.map((t) => (
          <ToolBtn key={t.id} active={paint.tool === t.id} onClick={() => setTool(t.id)} title={t.label}>
            <span className="text-base leading-none">{t.icon}</span>
          </ToolBtn>
        ))}
      </Group>

      <Divider />

      <Group label="TOOLS">
        {FILL_TOOLS.map((t) => (
          <ToolBtn key={t.id} active={paint.tool === t.id} onClick={() => setTool(t.id)} title={t.label}>
            <span className="text-base leading-none">{t.icon}</span>
          </ToolBtn>
        ))}
        {SPECIAL_TOOLS.map((t) => (
          <ToolBtn key={t.id} active={paint.tool === t.id} onClick={() => setTool(t.id)} title={t.label}>
            <span className="text-base leading-none">{t.icon}</span>
          </ToolBtn>
        ))}
      </Group>

      <Divider />

      <Group label="SIZE">
        <div className="flex flex-col items-center gap-1.5">
          {SIZE_PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              title={`${s}px`}
              className={`w-9 h-7 grid place-items-center border rounded-md transition-all ${
                paint.size === s
                  ? "border-primary text-primary bg-primary/10 shadow-[0_0_10px_hsl(var(--primary)/0.35)]"
                  : "hairline text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              <span
                className="rounded-full bg-current"
                style={{ width: Math.min(s, 14), height: Math.min(s, 14) }}
              />
            </button>
          ))}
          <input
            type="range"
            min={1}
            max={40}
            value={paint.size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-primary"
            title={`${paint.size}px`}
          />
          <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
            {paint.size}px
          </span>
        </div>
      </Group>

      {(paint.tool === "spray" || paint.tool === "text") && (
        <>
          <Divider />
          <Group label={paint.tool === "spray" ? "DENSITY" : "FONT"}>
            {paint.tool === "spray" ? (
              <div className="flex flex-col items-center gap-1">
                <input
                  type="range"
                  min={4}
                  max={40}
                  value={paint.sprayDensity}
                  onChange={(e) => setSprayDensity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
                  {paint.sprayDensity}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <input
                  type="range"
                  min={10}
                  max={96}
                  value={paint.fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
                  {paint.fontSize}px
                </span>
              </div>
            )}
          </Group>
        </>
      )}

      <Divider />

      <Group label="ACTIONS">
        <ActionBtn onClick={onUndo} disabled={!history.canUndo} title="Undo">↶</ActionBtn>
        <ActionBtn onClick={onRedo} disabled={!history.canRedo} title="Redo">↷</ActionBtn>
        {paint.tool === "select" && (
          <ActionBtn onClick={onCrop} title="Crop to selection">⛶</ActionBtn>
        )}
        <ActionBtn onClick={onSave} title="Quick save PNG">⤓</ActionBtn>
        <ActionBtn onClick={handleExportPng} title="Export PNG + JSON">⇪</ActionBtn>
        <ActionBtn onClick={handleExportPdf} title="Export PDF">PDF</ActionBtn>
        <ActionBtn onClick={handleShare} title="Share canvas">↗</ActionBtn>
        <ActionBtn
          onClick={onTogglePinchOverlay}
          title="Toggle pinch confidence monitor"
        >
          {pinchOverlayOn ? "◉" : "○"}
        </ActionBtn>
        <ActionBtn onClick={onClear} title="Clear canvas" tone="danger">✕</ActionBtn>
      </Group>
    </aside>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-stretch gap-1.5">
      <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground text-center">
        {label}
      </span>
      <div className="flex flex-col items-stretch gap-1">{children}</div>
    </div>
  );
}

function ToolBtn({
  active, onClick, title, children,
}: {
  active: boolean; onClick: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-full h-9 grid place-items-center border rounded-md transition-all touch-manipulation active:scale-95 ${
        active
          ? "border-primary text-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
          : "hairline text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  onClick, disabled, title, tone, children,
}: {
  onClick: () => void; disabled?: boolean; title: string; tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`font-mono text-[11px] tracking-[0.15em] w-full h-8 border rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation active:scale-95 ${
        tone === "danger"
          ? "hairline text-destructive hover:bg-destructive/10 hover:border-destructive/60"
          : "hairline text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="h-px w-full bg-border/60" />;
}

function contrastText(hex: string): string {
  // Pick black/white text for the custom-color swatch label based on luminance.
  const c = hex.replace("#", "");
  if (c.length !== 6) return "#000";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#000" : "#fff";
}
