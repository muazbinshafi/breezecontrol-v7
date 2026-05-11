// Helper that mirrors the original `isSupabaseConfigured` flag from the
// generated client. The auto-generated client.ts in this environment no
// longer exports it, so we derive it from the env vars.
export const isSupabaseConfigured: boolean = Boolean(
  (import.meta as any).env?.VITE_SUPABASE_URL &&
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY,
);
