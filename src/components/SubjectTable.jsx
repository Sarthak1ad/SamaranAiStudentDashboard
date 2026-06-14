import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatNumber, formatPercent } from '../services/analyticsService';

const PAGE_SIZE = 8;

const columns = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'total', label: 'Attempts', sortable: true, numeric: true },
  { key: 'correct', label: 'Correct', sortable: true, numeric: true },
  { key: 'incorrect', label: 'Incorrect', sortable: true, numeric: true },
  { key: 'accuracy', label: 'Accuracy', sortable: true, numeric: true, isPercent: true },
  { key: 'coverage', label: 'Coverage', sortable: true, numeric: true, isPercent: true },
  { key: 'mastery', label: 'Mastery', sortable: true, numeric: true, isPercent: true },
  { key: 'uniqueAttended', label: 'Unique Attended', sortable: true, numeric: true },
  { key: 'uniqueCorrect', label: 'Unique Correct', sortable: true, numeric: true },
];

function getSortValue(row, key) {
  const value = row[key];
  if (value == null) return 0;
  if (typeof value === 'string') return value.toLowerCase();
  return Number(value);
}

export default function SubjectTable({ subjects }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('subject');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const stats = subjects?.stats || subjects || [];
    const list = Array.isArray(stats) ? stats : Object.values(stats);

    const filtered = list.filter((row) =>
      (row.subject || row.name || '')
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [subjects, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function renderCell(row, col) {
    const value = row[col.key];
    if (col.isPercent) return formatPercent(value);
    if (col.numeric) return formatNumber(value);
    return value ?? '—';
  }

  function SortIcon({ columnKey }) {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-600" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
    );
  }

  if (!rows.length && !search) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-gray-400">No subject data available for this student.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Subject Analytics</h3>
          <p className="text-sm text-gray-500">
            {rows.length} subject{rows.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-gray-400">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No subjects match your search.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr
                  key={`${row.subject || row.name}-${index}`}
                  className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.key === 'subject' ? 'font-medium text-white' : 'text-gray-300'
                      }`}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-6">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, rows.length)} of {rows.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
