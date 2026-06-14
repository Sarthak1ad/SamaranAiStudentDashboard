import { useCallback, useEffect, useState } from 'react';
import { fetchAnalytics, getStudentList } from '../services/analyticsService';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAnalytics();
      const studentList = getStudentList(data.perStudent);

      setAnalytics(data);
      setStudents(studentList);

      if (studentList.length > 0) {
        setSelectedStudentId((prev) =>
          prev && data.perStudent[prev] ? prev : studentList[0].id,
        );
      } else {
        setSelectedStudentId(null);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while loading analytics.');
      setAnalytics(null);
      setStudents([]);
      setSelectedStudentId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const selectedStudent =
    selectedStudentId && analytics?.perStudent
      ? analytics.perStudent[selectedStudentId]
      : null;

  useEffect(() => {
    if (!selectedStudentId && !selectedStudent) return;

    console.group('SELECTED STUDENT');
    console.log('Student ID:', selectedStudentId);
    console.log('Student Data:', selectedStudent);
    console.groupEnd();
  }, [selectedStudentId, selectedStudent]);

  return {
    analytics,
    students,
    selectedStudentId,
    selectedStudent,
    setSelectedStudentId,
    loading,
    error,
    refetch: loadAnalytics,
  };
}
