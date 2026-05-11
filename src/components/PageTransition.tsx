import { useRouterState } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Cinematic route transition wrapper. Animates the Outlet whenever the
 * pathname changes by re-mounting it with a unique key + entrance class.
 * Uses pure CSS keyframes from styles.css — no external animation lib.
 */
export function PageTransition({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [displayed, setDisplayed] = useState(pathname);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pending = useRef(pathname);

  useEffect(() => {
    if (pathname === displayed) return;
    pending.current = pathname;
    setPhase("out");
    // After the exit animation, swap content and play entry.
    const t = window.setTimeout(() => {
      setDisplayed(pending.current);
      setPhase("in");
    }, 220);
    return () => window.clearTimeout(t);
  }, [pathname, displayed]);

  return (
    <div
      key={displayed}
      className={
        phase === "in"
          ? "route-transition route-transition--in"
          : "route-transition route-transition--out"
      }
    >
      {children ?? <Outlet />}
    </div>
  );
}
