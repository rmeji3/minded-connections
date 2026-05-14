"use client";

import { useState } from "react";
import type { Step, VisitMode } from "@/lib/appointments-types";

const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// May 2026: May 1 = Friday (index 5)
function getDateLabel(day: number): string {
  const dayOfWeek = (5 + day - 1) % 7;
  return `${DOW_NAMES[dayOfWeek]}, ${MONTH_NAMES[4]} ${day}`;
}

export function useBookingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [visitType, setVisitType] = useState<string | null>(null);
  const [visitMode, setVisitMode] = useState<VisitMode>("telehealth");
  const [selectedDate, setSelectedDate] = useState<number | null>(19);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const reset = () => {
    setStep(1);
    setVisitType(null);
    setVisitMode("telehealth");
    setSelectedDate(19);
    setSelectedTime(null);
    setNotes("");
    setConfirmed(false);
  };

  return {
    step, setStep,
    visitType, setVisitType,
    visitMode, setVisitMode,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    notes, setNotes,
    confirmed, setConfirmed,
    reset,
    getDateLabel,
  };
}
