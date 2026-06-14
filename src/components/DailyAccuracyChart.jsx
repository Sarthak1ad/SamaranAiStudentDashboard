import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPercent } from '../services/analyticsService';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/95 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-violet-400">
        Accuracy: {formatPercent(payload[0].payload.rawAccuracy)}
      </p>
    </div>
  );
}

export default function DailyAccuracyChart({ daily }) {
  const data = (daily || []).map((item) => {
    const rawAccuracy = Number(item.accuracy ?? 0);
    return {
      date: item.date || item.day || '',
      rawAccuracy,
      accuracy: rawAccuracy * (rawAccuracy <= 1 && rawAccuracy >= 0 ? 100 : 1),
    };
  });

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No daily data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="url(#lineGradient)"
          strokeWidth={2.5}
          dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
