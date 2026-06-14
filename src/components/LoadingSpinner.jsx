export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-white/20 border-t-violet-400`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="skeleton mb-3 h-4 w-24 rounded-lg" />
      <div className="skeleton h-8 w-16 rounded-lg" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="skeleton mb-6 h-5 w-40 rounded-lg" />
      <div className="skeleton h-64 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="skeleton mb-4 h-5 w-48 rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}
