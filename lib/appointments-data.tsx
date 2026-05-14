import type { ApptGroup, PastGroup, CancelledAppt, VisitType, TimeSlot } from "@/lib/appointments-types";

export const UPCOMING_GROUPS: ApptGroup[] = [
  {
    label: "This week",
    range: "May 11 – May 17",
    items: [
      {
        month: "MAY",
        day: 19,
        dow: "TUE",
        title: "Medication ",
        titleEm: "follow-up",
        badges: [
          { label: "NEXT", type: "next" },
          { label: "TELEHEALTH", type: "telehealth" },
        ],
        timeRange: "2:30–3:00 pm",
        provider: "Dr. Michelle Hernandez",
        duration: "30 min",
        note: "You mentioned reviewing the evening sertraline dose and following up on sleep — Dr. H has your journal notes from May 10.",
        primaryAction: "join",
        countdown: "In 5 days · 2:30 pm",
      },
    ],
  },
  {
    label: "Next two weeks",
    range: "May 18 – May 31",
    items: [
      {
        month: "MAY",
        day: 26,
        dow: "TUE",
        title: "Therapy ",
        titleEm: "session",
        badges: [{ label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00–3:50 pm",
        provider: "Jules Liu, LMFT",
        duration: "50 min",
        primaryAction: "view",
      },
      {
        month: "JUN",
        day: 2,
        dow: "TUE",
        title: "Therapy ",
        titleEm: "session",
        badges: [{ label: "IN-PERSON", type: "in-person" }],
        timeRange: "3:00–3:50 pm",
        provider: "Jules Liu, LMFT",
        duration: "50 min",
        location: "Corona office · Suite 210",
        primaryAction: "view",
      },
    ],
  },
];

export const PAST_GROUPS: PastGroup[] = [
  {
    label: "May 2026",
    count: 2,
    items: [
      {
        month: "MAY", day: 12, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
        note: "Visit summary uploaded May 12. Action item: continue 5-minute morning walks; check in on sleep at next session.",
      },
      {
        month: "APR", day: 30, dow: "Thu",
        title: "Medication ", titleEm: "follow-up",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "2:30 pm – 3:00 pm", provider: "Dr. Michelle Hernandez",
        note: "Plan: hold sertraline at 50mg, add bupropion XL 150mg in the morning. Revisit in 3 weeks.",
      },
    ],
  },
  {
    label: "April 2026",
    count: 3,
    items: [
      {
        month: "APR", day: 21, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
      },
      {
        month: "APR", day: 14, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "IN-PERSON", type: "in-person" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
        location: "Corona office",
      },
      {
        month: "APR", day: 7, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
      },
    ],
  },
  {
    label: "March 2026",
    count: 4,
    items: [
      {
        month: "MAR", day: 31, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
      },
      {
        month: "MAR", day: 24, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "IN-PERSON", type: "in-person" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
        location: "Corona office",
      },
      {
        month: "MAR", day: 17, dow: "Tue",
        title: "Medication ", titleEm: "follow-up",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "2:30 pm – 3:00 pm", provider: "Dr. Michelle Hernandez",
        note: "Increased sertraline from 25mg to 50mg. Monitor over the next 2 to 3 weeks.",
      },
      {
        month: "MAR", day: 10, dow: "Tue",
        title: "Therapy ", titleEm: "session",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "TELEHEALTH", type: "telehealth" }],
        timeRange: "3:00 pm – 3:50 pm", provider: "Jules Liu, LMFT",
      },
    ],
  },
  {
    label: "February 2026",
    count: 2,
    items: [
      {
        month: "FEB", day: 24, dow: "Tue",
        title: "Full ", titleEm: "evaluation",
        badges: [{ label: "COMPLETED", type: "completed" }, { label: "IN-PERSON", type: "in-person" }],
        timeRange: "10:00 am – 11:30 am", provider: "Dr. Michelle Hernandez",
        location: "Corona office",
        note: "Initial psychiatric evaluation completed. Diagnosed with MDD and GAD. Treatment plan established.",
      },
    ],
  },
];

export const CANCELLED_ITEMS: CancelledAppt[] = [
  {
    month: "MAR", day: 3, dow: "Tue",
    title: "Therapy ", titleEm: "session",
    timeRange: "3:00 pm – 3:50 pm",
    provider: "Jules Liu, LMFT",
    reason: "Provider unavailable — rescheduled to Mar 10.",
  },
];

export const VISIT_TYPES: VisitType[] = [
  {
    id: "med-followup",
    label: "Medication follow-up",
    duration: "30 min",
    provider: "Dr. Hernandez",
    recommended: true,
    description: "Check in on how meds are working, adjust dose, refill scripts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
        <path d="M9 12h6m-3-3v6" />
      </svg>
    ),
  },
  {
    id: "therapy",
    label: "Therapy session",
    duration: "50 min",
    provider: "Jules Liu LMFT",
    description: "Talk through what's been on your mind. Ongoing weekly or as needed.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
      </svg>
    ),
  },
  {
    id: "eval",
    label: "Full evaluation",
    duration: "90 min",
    provider: "Dr. Hernandez",
    description: "Comprehensive review — history, symptoms, and a plan forward.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    id: "urgent",
    label: "Urgent concern",
    duration: "20 min",
    provider: "Same-week opening",
    description: "Need a quick check-in this week? We hold a few slots for this.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
];

// Calendar data for May 2026 — May 1 = Friday (index 5 in Sun=0 week)
export const MAY_AVAILABLE = new Set([14, 15, 19, 21, 22, 26, 28]);
export const TODAY_DAY = 14;

export const MORNING_SLOTS: TimeSlot[] = [
  { label: "8:30 am", available: true },
  { label: "9:00 am", available: true },
  { label: "9:30 am", available: false },
  { label: "10:00 am", available: true },
  { label: "10:30 am", available: false },
  { label: "11:00 am", available: true },
  { label: "11:30 am", available: true },
  { label: "12:00 pm", available: false },
];

export const AFTERNOON_SLOTS: TimeSlot[] = [
  { label: "1:00 pm", available: true },
  { label: "1:30 pm", available: false },
  { label: "2:00 pm", available: true },
  { label: "2:30 pm", available: true },
  { label: "3:00 pm", available: false },
  { label: "3:30 pm", available: true },
  { label: "4:00 pm", available: true },
  { label: "4:30 pm", available: false },
];
