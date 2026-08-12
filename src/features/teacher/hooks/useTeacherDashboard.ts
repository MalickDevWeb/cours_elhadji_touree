import { useState, useMemo } from 'react';
import { Teacher, Assignment, Student, Group, Subject } from '../../../types';

export function useTeacherDashboard(
  me: Teacher,
  assignments: Assignment[],
  groups: Group[],
  students: Student[],
  subjects: Subject[],
  externalSimulatedTime?: string,
  externalSetSimulatedTime?: (val: string) => void
) {
  const [activeTab, setActiveTab] = useState<'ACCUEIL' | 'SCHEDULE' | 'CLASSES' | 'PARAMETRES'>('ACCUEIL');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [localSimulatedTime, localSetSimulatedTime] = useState('2026-07-18T10:15:00');
  const simulatedTime = externalSimulatedTime !== undefined ? externalSimulatedTime : localSimulatedTime;
  const setSimulatedTime = externalSetSimulatedTime !== undefined ? externalSetSimulatedTime : localSetSimulatedTime;

  const myAssignments = useMemo(() => {
    return assignments.filter(a => a.teacherId === me.id);
  }, [assignments, me.id]);

  const myGroups = useMemo(() => {
    return groups.filter(g => g.teacherId === me.id);
  }, [groups, me.id]);

  const myStudents = useMemo(() => {
    const ids = new Set<string>();
    myAssignments.forEach(a => {
      if (a.type === 'INDIVIDUEL' && a.studentId) {
        ids.add(a.studentId);
      }
    });
    myGroups.forEach(g => {
      g.studentIds.forEach(id => ids.add(id));
    });
    return students.filter(s => ids.has(s.id));
  }, [myAssignments, myGroups, students]);

  // Find next course or current course
  const nextCourse = useMemo(() => {
    if (myAssignments.length === 0) return null;
    return myAssignments[0];
  }, [myAssignments]);

  const stats = useMemo(() => {
    return {
      coursesCount: myAssignments.length,
      classesCount: myGroups.length,
      studentsCount: myStudents.length,
    };
  }, [myAssignments, myGroups, myStudents]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowScanner(false);
  };

  return {
    activeTab,
    setActiveTab,
    selectedCourseId,
    setSelectedCourseId,
    showScanner,
    setShowScanner,
    selectedClassId,
    setSelectedClassId,
    simulatedTime,
    setSimulatedTime,
    myAssignments,
    myGroups,
    myStudents,
    nextCourse,
    stats,
    handleSelectCourse,
  };
}
