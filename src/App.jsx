import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import {
  clearAuthCallbackFromUrl,
  getSession,
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

function RootRedirect({ loading }) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-sm text-gray-500">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hasAuthCallback =
    new URLSearchParams(location.search).has('code') ||
    new URLSearchParams(location.search).has('error');

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const currentSession = await getSession();
        if (!mounted) return;

        setSession(currentSession);

        if (hasAuthCallback && currentSession) {
          clearAuthCallbackFromUrl();
        }
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

        if (event === 'SIGNED_IN') {
          clearAuthCallbackFromUrl();
        }
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

  if (hasAuthCallback && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-sm text-gray-500">Completing sign in...</p>
        </div>
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
        path="/"
        element={<RootRedirect loading={loading} />}
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
