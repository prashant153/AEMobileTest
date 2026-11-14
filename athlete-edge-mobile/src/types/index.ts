export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface Athlete {
  id: string;
  name: string;
  age: number;
  sport: string;
  academyId: string;
  level: TrainingLevel;
  avatar: string;
  readinessScore: number;
  lastActive: string;
}

export interface Coach {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  experience: number;
  activeAthletes: number;
  rating: number;
}

export interface Academy {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  headCoachId: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  coachId: string;
  academyId: string;
  date: string;
  startTime: string;
  endTime: string;
  focus: string;
  intensity: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'cancelled';
  attendanceRate: number;
}

export interface Batch {
  id: string;
  name: string;
  academyId: string;
  sport: string;
  size: number;
  level: TrainingLevel;
  coachId: string;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  date: string;
  totalAthletes: number;
  present: number;
  late: number;
  excused: number;
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  change: number;
  changeDirection: 'up' | 'down';
  suffix?: string;
}

export interface PerformanceTrendPoint {
  month: string;
  attendance: number;
  readiness: number;
  sessions: number;
}

