/**
 * Resolves the app origin for OAuth redirects.
 * Uses runtime window.location on the client so Vercel preview/production URLs
 * are always correct. VITE_APP_URL is an optional explicit override.
 */
export function getAppOrigin() {
  const envOrigin = (import.meta.env.VITE_APP_URL || '').trim().replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const runtimeOrigin = window.location.origin;

    // Local dev: always use the browser origin (e.g. http://localhost:3000)
    if (runtimeOrigin.includes('localhost') || runtimeOrigin.includes('127.0.0.1')) {
      return runtimeOrigin;
    }

    // Production / Vercel previews: prefer live browser origin over a stale build-time env
    return runtimeOrigin;
  }

  return envOrigin;
}

export function getAuthRedirectUrl() {
  return `${getAppOrigin()}/dashboard`;
}
