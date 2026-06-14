import { supabase } from '../lib/supabase';

export async function fetchAnalytics() {
  if (!navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  const { data, error } = await supabase.functions.invoke('get_analytics_all_full');

  console.group('EDGE FUNCTION RESPONSE');
  console.log('Raw Response:', data);
  console.log('Success:', data?.success);
  console.log('Students Count:', Object.keys(data?.perStudent || {}).length);
  console.groupEnd();

  if (error) {
    throw new Error(error.message || 'Failed to fetch analytics from edge function.');
  }

  if (!data) {
    throw new Error('No data returned from analytics service.');
  }

  if (data.success === false) {
    throw new Error(data.error || data.message || 'Analytics request was unsuccessful.');
  }

  if (!data.perStudent || typeof data.perStudent !== 'object') {
    throw new Error('Invalid analytics response format.');
  }

  return data;
}

export function getStudentList(perStudent) {
  if (!perStudent) return [];

  return Object.entries(perStudent).map(([studentId, studentData]) => ({
    id: studentId,
    name:
      studentData?.user?.name ||
      studentData?.user?.full_name ||
      studentData?.user?.displayName ||
      'Unknown Student',
    email: studentData?.user?.email || '',
    data: studentData,
  }));
}

export function getStudentById(perStudent, studentId) {
  if (!perStudent || !studentId) return null;
  return perStudent[studentId] || null;
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '0';
  const num = Number(value);
  // API sends decimal ratios (e.g. 0.68) — display as-is, do not multiply by 100
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

export function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return '0';
  return Number(value).toLocaleString();
}
