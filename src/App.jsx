import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import {
  completeOAuthCallback,
  getSession,
  redirectToDashboard,
  supabase,
} from './lib/supabase';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function PublicRoute({ session, loading, children }) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AuthCallbackHandler() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function handleCallback() {
      try {
        const session = await completeOAuthCallback();

        if (!mounted) return;

        if (session) {
          redirectToDashboard();
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Sign in failed. Please try again.');
      }
    }

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-4">
        <p className="text-center text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-sm text-gray-500">Completing sign in...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const hasAuthCallback =
    new URLSearchParams(location.search).has('code') ||
    new URLSearchParams(location.search).has('error');

  useEffect(() => {
    if (hasAuthCallback) return;

    let mounted = true;

    async function initAuth() {
      try {
        const currentSession = await getSession();
        if (mounted) setSession(currentSession);
      } catch {
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setSession(newSession);
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hasAuthCallback]);

  // Redirect any ?code= URL (/, /dashboard, etc.) to the auth callback handler
  useEffect(() => {
    if (!hasAuthCallback) return;
    if (location.pathname === '/auth/callback') return;

    navigate(`/auth/callback${location.search}`, { replace: true });
  }, [hasAuthCallback, location.pathname, location.search, navigate]);

  if (hasAuthCallback && location.pathname.startsWith('/auth/callback')) {
    return (
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackHandler />} />
      </Routes>
    );
  }

  if (hasAuthCallback && location.pathname === '/') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute session={session} loading={loading}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={<Dashboard sessionUser={session?.user} />}
      />
      <Route
        path="/auth/callback"
        element={<AuthCallbackHandler />}
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
