import {
  AlertCircle,
  BarChart3,
  Mail,
  RefreshCw,
  User,
  WifiOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CorrectIncorrectPie from '../components/CorrectIncorrectPie';
import DailyAccuracyChart from '../components/DailyAccuracyChart';
import { DashboardSkeleton } from '../components/LoadingSpinner';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StudentSelector from '../components/StudentSelector';
import SubjectAccuracyChart from '../components/SubjectAccuracyChart';
import SubjectTable from '../components/SubjectTable';
import { useAnalytics } from '../hooks/useAnalytics';
import { signOut } from '../lib/supabase';
import { formatNumber, formatPercent } from '../services/analyticsService';

function getSubjectList(subjects) {
  const stats = subjects?.stats || subjects || [];
  return Array.isArray(stats) ? stats : Object.values(stats);
}

function ProfileCard({ user }) {
  const studentUser = user || {};
  const name =
    studentUser.name ||
    studentUser.full_name ||
    studentUser.displayName ||
    'Unknown';
  const email = studentUser.email || '—';
  const googleId =
    studentUser.googleId ||
    studentUser.google_id ||
    studentUser.sub ||
    studentUser.id ||
    '—';

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Student Profile</h3>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
          <User className="h-8 w-8 text-violet-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Name:</span>
            <span className="text-sm font-medium text-white">{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Email:</span>
            <span className="text-sm font-medium text-white">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Google ID:</span>
            <span className="truncate text-sm font-medium text-white">{googleId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyAnalytics() {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <BarChart3 className="h-8 w-8 text-gray-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No Analytics Available</h3>
      <p className="max-w-sm text-sm text-gray-500">
        This student hasn&apos;t attended any questions yet. Analytics will appear once
        activity begins.
      </p>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  const isOffline = error?.toLowerCase().includes('internet');

  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        {isOffline ? (
          <WifiOff className="h-8 w-8 text-red-400" />
        ) : (
          <AlertCircle className="h-8 w-8 text-red-400" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {isOffline ? 'You are offline' : 'Failed to load analytics'}
      </h3>
      <p className="mb-6 max-w-md text-sm text-gray-500">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

function StudentsGrid({ students, selectedStudentId, onSelect }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => {
        const isSelected = student.id === selectedStudentId;
        const stats = student.data?.overall?.stats || {};

        return (
          <button
            key={student.id}
            type="button"
            onClick={() => onSelect(student.id)}
            className={`glass rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
              isSelected
                ? 'border-violet-500/40 ring-1 ring-violet-500/30'
                : 'hover:border-white/10'
            }`}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              <User className="h-5 w-5 text-violet-400" />
            </div>
            <h4 className="mb-1 font-semibold text-white">{student.name}</h4>
            <p className="mb-3 truncate text-xs text-gray-500">{student.email}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{stats.attendedTotal ?? 0} attempts</span>
              <span>{formatPercent(stats.accuracy)} accuracy</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function Dashboard({ sessionUser }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);

  const {
    students,
    selectedStudentId,
    selectedStudent,
    setSelectedStudentId,
    loading,
    error,
    refetch,
  } = useAnalytics();

  const overallStats = selectedStudent?.overall?.stats || {};
  const hasAnalytics = Number(overallStats.attendedTotal ?? 0) > 0;
  const previousStudentIdRef = useRef(selectedStudentId);

  useEffect(() => {
    if (loading || error || !selectedStudent) return;

    const stats = selectedStudent?.overall?.stats || {};
    const subjects = getSubjectList(selectedStudent?.subjects);
    const daily = selectedStudent?.daily || [];

    console.group('OVERALL STATS VERIFY');
    console.table({
      attendedTotal: stats?.attendedTotal,
      totalCorrect: stats?.totalCorrect,
      totalIncorrect: stats?.totalIncorrect,
      totalUniqueAttended: stats?.totalUniqueAttended,
      totalCorrectUnique: stats?.totalCorrectUnique,
      uniqueIncorrect: stats?.uniqueIncorrect,
      accuracy: stats?.accuracy,
      avgScore: stats?.avgScore,
      coverage: stats?.coverage,
      mastery: stats?.mastery,
    });
    console.groupEnd();

    console.group('SUBJECT ANALYTICS VERIFY');
    subjects?.forEach((subject) => {
      console.table({
        subject: subject.subject,
        total: subject.total,
        correct: subject.correct,
        incorrect: subject.incorrect,
        totalQuestions: subject.totalQuestions,
        coverage: subject.coverage,
        mastery: subject.mastery,
        accuracy: subject.accuracy,
        uniqueAttended: subject.uniqueAttended,
        uniqueCorrect: subject.uniqueCorrect,
      });
    });
    console.groupEnd();

    console.group('DAILY PERFORMANCE VERIFY');
    console.table(daily);
    console.groupEnd();

    const displayedTotalAttempts = formatNumber(stats?.attendedTotal);
    const displayedCorrect = formatNumber(stats?.totalCorrect);
    const displayedIncorrect = formatNumber(stats?.totalIncorrect);
    const displayedAccuracy = formatPercent(stats?.accuracy);
    const displayedCoverage = formatPercent(stats?.coverage);
    const displayedMastery = formatPercent(stats?.mastery);

    console.group('FINAL DASHBOARD CROSS CHECK');
    console.table({
      Dashboard_TotalAttempts: displayedTotalAttempts,
      JSON_TotalAttempts: stats?.attendedTotal,

      Dashboard_Correct: displayedCorrect,
      JSON_Correct: stats?.totalCorrect,

      Dashboard_Incorrect: displayedIncorrect,
      JSON_Incorrect: stats?.totalIncorrect,

      Dashboard_Accuracy: displayedAccuracy,
      JSON_Accuracy: stats?.accuracy,
      JSON_Accuracy_Raw: stats?.accuracy,

      Dashboard_Coverage: displayedCoverage,
      JSON_Coverage: stats?.coverage,
      JSON_Coverage_Raw: stats?.coverage,

      Dashboard_Mastery: displayedMastery,
      JSON_Mastery: stats?.mastery,
      JSON_Mastery_Raw: stats?.mastery,
    });
    console.groupEnd();
  }, [loading, error, selectedStudent, selectedStudentId]);

  function handleStudentSelect(newStudentId) {
    const previousStudentId = previousStudentIdRef.current;

    console.group('STUDENT SWITCH');
    console.log('Previous Student:', previousStudentId);
    console.log('New Student:', newStudentId);
    console.groupEnd();

    previousStudentIdRef.current = newStudentId;
    setSelectedStudentId(newStudentId);
  }

  async function handleLogout() {
    if (!sessionUser) {
      navigate('/login');
      return;
    }

    try {
      await signOut();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  }

  function handleLogin() {
    navigate('/login');
  }

  async function handleRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  function renderCharts() {
    if (!hasAnalytics) return <EmptyAnalytics />;

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">Daily Accuracy</h3>
          <DailyAccuracyChart daily={selectedStudent?.daily} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Subject Accuracy</h3>
          <SubjectAccuracyChart subjects={selectedStudent?.subjects} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Correct vs Incorrect</h3>
          <CorrectIncorrectPie stats={overallStats} />
        </div>
      </div>
    );
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-6 py-8">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500">Loading analytics data...</p>
          <DashboardSkeleton />
        </div>
      );
    }

    if (error) {
      return <ErrorState error={error} onRetry={refetch} />;
    }

    if (!students.length) {
      return (
        <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <AlertCircle className="mb-4 h-10 w-10 text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-white">No Students Found</h3>
          <p className="text-sm text-gray-500">
            No student analytics data is available at this time.
          </p>
        </div>
      );
    }

    if (activeSection === 'students') {
      return (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold text-white">All Students</h2>
            <p className="text-sm text-gray-500">
              Select a student to view their analytics
            </p>
          </div>
          <StudentsGrid
            students={students}
            selectedStudentId={selectedStudentId}
            onSelect={(id) => {
              handleStudentSelect(id);
              setActiveSection('dashboard');
            }}
          />
        </div>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <div className="space-y-6 animate-fade-in">
          <StudentSelector
            students={students}
            selectedStudentId={selectedStudentId}
            onSelect={handleStudentSelect}
          />
          <SubjectTable subjects={selectedStudent?.subjects} />
          {renderCharts()}
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <StudentSelector
          students={students}
          selectedStudentId={selectedStudentId}
          onSelect={handleStudentSelect}
        />

        <StatCard stats={overallStats} />

        <ProfileCard user={selectedStudent?.user} />

        {renderCharts()}

        <SubjectTable subjects={selectedStudent?.subjects} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        onLogin={handleLogin}
        isAuthenticated={Boolean(sessionUser)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar
          user={sessionUser}
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={handleRefresh}
          refreshing={refreshing || loading}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
