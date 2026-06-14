import { ChevronDown, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function StudentSelector({
  students,
  selectedStudentId,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!students.length) {
    return (
      <div className="glass rounded-2xl px-4 py-3 text-sm text-gray-400">
        No students available
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="glass-strong flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Selected Student</p>
            <p className="text-sm font-semibold text-white">
              {selectedStudent?.name || 'Select a student'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-white/10 bg-gray-900/95 py-2 shadow-2xl backdrop-blur-xl"
          role="listbox"
        >
          {students.map((student) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <li key={student.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(student.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full flex-col px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-violet-500/15 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">{student.name}</span>
                  {student.email && (
                    <span className="text-xs text-gray-500">{student.email}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
