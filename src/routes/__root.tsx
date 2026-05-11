import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { useCloudProfileSync } from "@/hooks/useCloudProfileSync";
import { PageTransition } from "@/components/PageTransition";
import { SiteAtmosphere } from "@/components/SiteAtmosphere";

import appCss from "../styles.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1",
      },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "BreezeControl" },
      { name: "theme-color", content: "#fff7ed" },
      { name: "color-scheme", content: "light dark" },
      { name: "format-detection", content: "telephone=no" },
      { title: "BreezeControl — Touch-free gesture control for the web" },
      {
        name: "description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "BreezeControl — Touch-free gesture control for the web" },
      {
        property: "og:description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BreezeControl — Touch-free gesture control for the web" },
      {
        name: "twitter:description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/036558f9-d137-4987-9412-cb4ed8836ad2/id-preview-5ade9692--c485883a-4871-4fc3-bb12-8cb95aa9ed9b.lovable.app-1777532530438.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/036558f9-d137-4987-9412-cb4ed8836ad2/id-preview-5ade9692--c485883a-4871-4fc3-bb12-8cb95aa9ed9b.lovable.app-1777532530438.png" },
      { name: "description", content: "Project Playground is a web application for editing and deploying code projects." },
      { property: "og:description", content: "Project Playground is a web application for editing and deploying code projects." },
      { name: "twitter:description", content: "Project Playground is a web application for editing and deploying code projects." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "" },
      { rel: "preconnect", href: "https://storage.googleapis.com", crossOrigin: "" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "dns-prefetch", href: "https://storage.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function CloudSyncBoot() {
  useCloudProfileSync();
  // Apply a shareable preset (?preset=...) once on first mount.
  useEffect(() => {
    const w = window as unknown as { __presetLoaded?: boolean };
    if (w.__presetLoaded) return;
    w.__presetLoaded = true;
    import("@/lib/omnipoint/GestureSettingsShare").then((m) => m.loadPresetFromUrl());
  }, []);
  return null;
}

function RootComponent() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* SW registration is best-effort */
    });
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CloudSyncBoot />
            <Toaster />
            <Sonner />
            <SiteAtmosphere />
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
}
