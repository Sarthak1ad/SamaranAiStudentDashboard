import { BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  function handleSkipLogin() {
    navigate('/dashboard', { replace: true });
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
              Access the dashboard to view analytics
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

          <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
            ✓ Authentication has been disabled for development/testing
          </div>

          <button
            type="button"
            onClick={handleSkipLogin}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10"
          >
            Continue to Dashboard
          </button>

          <p className="mt-6 text-center text-xs text-gray-600">
            No authentication required — open access for testing
          </p>
        </div>
      </div>
    </div>
  );
}
