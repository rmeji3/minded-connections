export type View = "list" | "book";
export type Tab = "upcoming" | "past" | "cancelled";
export type Step = 1 | 2 | 3 | 4;
export type VisitMode = "telehealth" | "in-person";

export interface Appointment {
  id: string;
  month: string;
  day: number;
  dow: string;
  title: string;
  titleEm: string;
  badges: Array<{ label: string; type: "next" | "telehealth" | "in-person" }>;
  timeRange: string;
  provider: string;
  duration: string;
  location?: string;
  note?: string;
  primaryAction: "join" | "view";
  meetingUrl?: string;
  countdown?: string;
}

export interface ApptGroup {
  label: string;
  range: string;
  items: Appointment[];
}

export interface VisitType {
  id: string;
  label: string;
  duration: string;
  provider: string;
  description: string;
  recommended?: boolean;
  icon: React.ReactNode;
}

export interface TimeSlot {
  label: string;
  available: boolean;
}

export interface PastAppt {
  month: string;
  day: number;
  dow: string;
  title: string;
  titleEm?: string;
  badges: Array<{ label: string; type: "completed" | "telehealth" | "in-person" }>;
  timeRange: string;
  provider: string;
  location?: string;
  note?: string;
}

export interface PastGroup {
  label: string;
  count: number;
  items: PastAppt[];
}

export interface CancelledAppt {
  month: string;
  day: number;
  dow: string;
  title: string;
  titleEm?: string;
  timeRange: string;
  provider: string;
  reason: string;
}
