import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '../services/analyticsService';

const COLORS = ['#10b981', '#ef4444'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/95 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
        {payload[0].name}: {formatNumber(payload[0].value)}
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="mt-2 flex justify-center gap-6">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function CorrectIncorrectPie({ stats }) {
  const correct = Number(stats?.totalCorrect ?? 0);
  const incorrect = Number(stats?.totalIncorrect ?? 0);

  const data = [
    { name: 'Correct', value: correct, fill: COLORS[0] },
    { name: 'Incorrect', value: incorrect, fill: COLORS[1] },
  ].filter((item) => item.value > 0);

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No attempt data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
