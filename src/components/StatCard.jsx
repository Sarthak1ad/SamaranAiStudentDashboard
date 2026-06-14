import {
  Award,
  BookOpen,
  CheckCircle2,
  Crosshair,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { formatNumber, formatPercent } from '../services/analyticsService';

const statConfig = [
  {
    key: 'attendedTotal',
    label: 'Total Attempts',
    icon: Zap,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    key: 'totalCorrect',
    label: 'Correct Answers',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
  },
  {
    key: 'totalIncorrect',
    label: 'Incorrect Answers',
    icon: XCircle,
    gradient: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/20',
  },
  {
    key: 'totalUniqueAttended',
    label: 'Unique Attended',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    key: 'totalCorrectUnique',
    label: 'Unique Correct',
    icon: Target,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/20',
  },
  {
    key: 'accuracy',
    label: 'Accuracy',
    icon: TrendingUp,
    gradient: 'from-indigo-500 to-violet-600',
    shadow: 'shadow-indigo-500/20',
    isPercent: true,
  },
  {
    key: 'coverage',
    label: 'Coverage',
    icon: Crosshair,
    gradient: 'from-fuchsia-500 to-purple-600',
    shadow: 'shadow-fuchsia-500/20',
    isPercent: true,
  },
  {
    key: 'mastery',
    label: 'Mastery',
    icon: Award,
    gradient: 'from-sky-500 to-indigo-600',
    shadow: 'shadow-sky-500/20',
    isPercent: true,
  },
];

export default function StatCard({ stats }) {
  const overallStats = stats || {};

  console.log('CARD SOURCE DATA', overallStats);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-8">
      {statConfig.map(({ key, label, icon: Icon, gradient, shadow, isPercent }, index) => {
        const value = overallStats[key];
        const displayValue = isPercent
          ? formatPercent(value)
          : formatNumber(value);

        console.log('CARD RENDER', {
          title: label,
          key,
          rawValue: value,
          value: displayValue,
        });

        return (
          <div
            key={key}
            className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/50 p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${shadow} animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
            />
            <div
              className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-2 shadow-lg ${shadow}`}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
            <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {displayValue}
            </p>
          </div>
        );
      })}
    </div>
  );
}
