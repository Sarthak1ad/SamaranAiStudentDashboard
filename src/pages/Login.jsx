import { BarChart3, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { isSupabaseConfigured, signInWithGoogle } from '../lib/supabase';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      // Browser redirects to Google — keep loading state until navigation
    } catch (err) {
      const message =
        err?.message ||
        err?.error_description ||
        'Failed to sign in with Google. Please try again.';
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-violet-500/10 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Student Analytics
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to access your multi-student analytics dashboard
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <BarChart3 className="h-5 w-5 text-violet-400" />
              <p className="text-sm text-gray-400">Real-time performance tracking</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <p className="text-sm text-gray-400">Multi-student insights & charts</p>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              Copy <code className="text-amber-200">.env.example</code> to{' '}
              <code className="text-amber-200">.env</code> and add your Supabase credentials.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-gray-600">
            Secured by Supabase Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
