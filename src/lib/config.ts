declare global {
  interface Window {
    APP_CONFIG?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

export function getConfig() {
  const runtimeConfig = window.APP_CONFIG || {};

  const supabaseUrl =
    runtimeConfig.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL;

  const supabaseAnonKey =
    runtimeConfig.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    source: runtimeConfig.VITE_SUPABASE_URL ? 'runtime' : 'build-time'
  };
}
