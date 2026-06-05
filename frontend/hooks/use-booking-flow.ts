"use client";

import { useState } from "react";
import type { Step, VisitMode } from "@/lib/appointments-types";
import { SlotDto } from "@/lib/scheduling-api";

const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getDateLabel(date: Date): string {
  return `${DOW_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

export function useBookingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [visitType, setVisitType] = useState<string | null>(null);
  const [visitMode, setVisitMode] = useState<VisitMode>("telehealth");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [rescheduleApptId, setRescheduleApptId] = useState<string | null>(null);

  const reset = () => {
    setStep(1);
    setVisitType(null);
    setVisitMode("telehealth");
    setSelectedDate(null);
    setSelectedSlot(null);
    setNotes("");
    setConfirmed(false);
    setRescheduleApptId(null);
  };

  return {
    step, setStep,
    visitType, setVisitType,
    visitMode, setVisitMode,
    selectedDate, setSelectedDate,
    selectedSlot, setSelectedSlot,
    notes, setNotes,
    confirmed, setConfirmed,
    rescheduleApptId, setRescheduleApptId,
    reset,
    getDateLabel,
  };
}
