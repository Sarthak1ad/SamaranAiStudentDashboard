import { Bell, Menu, RefreshCw } from 'lucide-react';

export default function Navbar({ user, onMenuClick, onRefresh, refreshing }) {
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';
  const email = user?.email || '';

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white sm:text-lg">
              Student Analytics
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Multi-student performance insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="hidden rounded-xl p-2 text-gray-400 transition-all hover:bg-white/5 hover:text-white disabled:opacity-50 sm:flex"
            aria-label="Refresh data"
            title="Refresh analytics"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>

          <button
            type="button"
            className="hidden rounded-xl p-2 text-gray-400 transition-all hover:bg-white/5 hover:text-white sm:flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-violet-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium text-white">{name}</p>
              <p className="truncate text-xs text-gray-500">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
