import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPercent } from '../services/analyticsService';

const COLORS = [
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/95 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="mb-1 text-xs text-gray-400">{payload[0].payload.subject}</p>
      <p className="text-sm font-semibold text-indigo-400">
        Accuracy: {formatPercent(payload[0].payload.rawAccuracy)}
      </p>
    </div>
  );
}

export default function SubjectAccuracyChart({ subjects }) {
  const stats = subjects?.stats || subjects || [];
  const list = Array.isArray(stats) ? stats : Object.values(stats);

  const data = list.map((item) => {
    const rawAccuracy = Number(item.accuracy ?? 0);
    return {
      subject: item.subject || item.name || 'Unknown',
      rawAccuracy,
      accuracy: rawAccuracy * (rawAccuracy <= 1 && rawAccuracy >= 0 ? 100 : 1),
    };
  });

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No subject data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="subject"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
