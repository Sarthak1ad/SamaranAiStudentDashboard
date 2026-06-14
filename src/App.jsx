import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { getSession, supabase } from './lib/supabase';
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

function RootRedirect({ session, loading }) {
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

  if (session && new URLSearchParams(window.location.search).has('code')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const hasAuthCode = new URLSearchParams(window.location.search).has('code');

    async function initAuth() {
      try {
        const currentSession = await getSession();
        if (!mounted) return;

        setSession(currentSession);

        if (hasAuthCode && currentSession) {
          window.history.replaceState({}, '', '/dashboard');
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

        if (event === 'SIGNED_IN' && new URLSearchParams(window.location.search).has('code')) {
          window.history.replaceState({}, '', '/dashboard');
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
  }, []);

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
        element={<RootRedirect session={session} loading={loading} />}
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
