"use client";

import { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/booking/progress-bar";
import { Step1VisitType } from "@/components/booking/step-1-visit-type";
import { Step2Schedule } from "@/components/booking/step-2-schedule";
import { Step3Notes } from "@/components/booking/step-3-notes";
import { Step4Review } from "@/components/booking/step-4-review";
import { ConfirmedView } from "@/components/booking/confirmed-view";
import type { Step, VisitMode } from "@/lib/appointments-types";
import { SlotDto, bookAppointment, rescheduleAppointment } from "@/lib/scheduling-api";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

interface BookingWizardProps {
  step: Step;
  setStep: (s: Step) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
  visitType: string | null;
  setVisitType: (v: string) => void;
  visitMode: VisitMode;
  setVisitMode: (m: VisitMode) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  selectedSlot: SlotDto | null;
  setSelectedSlot: (s: SlotDto | null) => void;
  notes: string;
  setNotes: (v: string) => void;
  onClose: () => void;
  getDateLabel: (d: Date) => string;
  isFirstVisit?: boolean;
  rescheduleApptId?: string | null;
}

export function BookingWizard({
  step, setStep, confirmed, setConfirmed,
  visitType, setVisitType, visitMode, setVisitMode,
  selectedDate, setSelectedDate, selectedSlot, setSelectedSlot,
  notes, setNotes, onClose, getDateLabel, isFirstVisit, rescheduleApptId
}: BookingWizardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step, confirmed]);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      if (rescheduleApptId) {
        await rescheduleAppointment(rescheduleApptId, { newSlotId: selectedSlot.id });
        // After rescheduling, also apply any updated notes or visit mode
        await apiRequest(`/scheduling/appointments/${rescheduleApptId}/edit`, {
          method: "PATCH",
          body: { visitMode, notes },
        });
        toast.success("Appointment rescheduled successfully");
      } else {
        await bookAppointment({
          slotId: selectedSlot.id,
          notes: notes,
          visitType: visitType || "Therapy Session",
          visitMode: visitMode,
        });
        toast.success("Appointment booked successfully");
      }
      setConfirmed(true);
    } catch (err: any) {
      console.error("Failed to process appointment", err);
      toast.error(err.message || "Failed to process appointment. The slot may no longer be available.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle className="sr-only">Book a visit</DialogTitle>
        <DialogDescription className="sr-only">Select a visit type, date, time, and confirm your appointment.</DialogDescription>
        <div style={{ position: "relative" }}>
          <DialogClose asChild>
            <button
              aria-label="Close booking dialog"
              style={{
                position: "absolute", top: -16, right: -16, width: 36, height: 36,
                borderRadius: "50%", background: "var(--warm-white)", border: "2px solid var(--linen)",
                boxShadow: "0 2px 10px rgba(39,35,32,0.18)", display: "inline-flex",
                alignItems: "center", justifyContent: "center", color: "var(--stone-600)",
                cursor: "pointer", zIndex: 10, fontSize: "1.125rem", lineHeight: 1,
                transition: "background 150ms, color 150ms, border-color 150ms",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "var(--sage-500)";
                btn.style.color = "white";
                btn.style.borderColor = "var(--sage-500)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "var(--warm-white)";
                btn.style.color = "var(--stone-600)";
                btn.style.borderColor = "var(--linen)";
              }}
            >
              ×
            </button>
          </DialogClose>

          <div
            style={{
              background: "var(--cream)", borderRadius: 20, width: "100%", maxHeight: "88vh",
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 24px 64px rgba(39,35,32,0.22)",
            }}
          >
            <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--linen)", flexShrink: 0 }}>
              <ProgressBar step={step} onStepClick={(s) => { if (s < step) setStep(s); }} />
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "1rem", willChange: "transform" }}>
              {confirmed && (
                <div className="wizard-step">
                  <ConfirmedView onBack={onClose} />
                </div>
              )}
              {!confirmed && step === 1 && (
                <div className="wizard-step">
                  <Step1VisitType
                    visitType={visitType} setVisitType={setVisitType}
                    visitMode={visitMode} setVisitMode={setVisitMode}
                    onContinue={() => setStep(2)}
                    isFirstVisit={isFirstVisit}
                  />
                </div>
              )}
              {!confirmed && step === 2 && (
                <div className="wizard-step">
                  <Step2Schedule
                    selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                    selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}
                    onContinue={() => setStep(3)} getDateLabel={getDateLabel}
                  />
                </div>
              )}
              {!confirmed && step === 3 && (
                <div className="wizard-step">
                  <Step3Notes notes={notes} setNotes={setNotes} onContinue={() => setStep(4)} />
                </div>
              )}
              {!confirmed && step === 4 && (
                <div className="wizard-step">
                  <Step4Review
                    visitType={visitType} visitMode={visitMode}
                    selectedDate={selectedDate} selectedSlot={selectedSlot} notes={notes}
                    onJumpToStep={setStep} onConfirm={handleConfirm} isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
