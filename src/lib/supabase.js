import { createClient } from '@supabase/supabase-js';
import { getAuthRedirectUrl } from './authRedirect';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    );
  }

  const redirectTo = getAuthRedirectUrl();
  console.info('[Auth] OAuth redirectTo:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: false,
      queryParams: {
        prompt: 'select_account',
        access_type: 'online',
      },
    },
  });

  if (error) throw error;

  if (data?.url) {
    window.location.assign(data.url);
  }

  return data;
}

export async function completeOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const authError = params.get('error_description') || params.get('error');

  if (authError) {
    throw new Error(authError);
  }

  if (!code) {
    return null;
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;

  return data.session;
}

export function redirectToDashboard() {
  const dashboardUrl = `${window.location.origin}/dashboard`;
  window.history.replaceState({}, '', dashboardUrl);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
