"use client";

import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Appointment } from "@/lib/appointments-types";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

interface EditApptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appt: Appointment | null;
  onEdited: () => void;
  onRescheduleClick: () => void;
}

export function EditApptDialog({ isOpen, onOpenChange, appt, onEdited, onRescheduleClick }: EditApptDialogProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [visitMode, setVisitMode] = useState<"in-person" | "telehealth">("telehealth");

  // Sync state when appt changes
  useEffect(() => {
    if (appt) {
      setNotes(appt.note || "");
      setVisitMode(appt.badges.some((b: any) => b.type === "in-person") ? "in-person" : "telehealth");
    }
  }, [appt]);

  if (!appt) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiRequest(`/scheduling/appointments/${appt.id}/edit`, {
        method: "PATCH",
        body: { visitMode, notes },
      });
      toast.success("Appointment updated successfully");
      onEdited();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="drawer-overlay is-open" style={{ opacity: isOpen ? 1 : 0 }} />
        <DialogPrimitive.Content
          className="radix-dialog-content"
          style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "90%", maxWidth: "500px", zIndex: 300,
          }}
        >
          <div style={{ position: "relative" }}>
            <DialogPrimitive.Close asChild>
              <button
                aria-label="Close dialog"
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
            </DialogPrimitive.Close>

            <div
              style={{
                background: "var(--cream)", borderRadius: 20, width: "100%", maxHeight: "88vh",
                display: "flex", flexDirection: "column", overflow: "hidden",
                boxShadow: "0 24px 64px rgba(39,35,32,0.22)",
              }}
            >
              <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
                <DialogPrimitive.Title style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)", margin: 0, marginBottom: "var(--sp-4)" }}>
                  Edit Appointment
                </DialogPrimitive.Title>

                <form onSubmit={handleSave} className="book-form">
            <div className="form-field">
              <label>Time & Date</label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--warm-white)", padding: "var(--sp-3)", borderRadius: "6px", border: "1px solid var(--linen)" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{appt.month} {appt.day}, {appt.timeRange}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--stone-500)" }}>{appt.provider}</div>
                </div>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => {
                    onOpenChange(false);
                    onRescheduleClick();
                  }}
                >
                  Pick new time
                </button>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: "var(--sp-3)" }}>
              <legend>Visit Mode</legend>
              <div className="form-row form-row--two">
                <label className="radio" style={{ margin: 0, padding: "var(--sp-3)", border: visitMode === "in-person" ? "1.5px solid var(--sage-500)" : "1.5px solid var(--linen)", borderRadius: 6, background: "var(--warm-white)", cursor: "pointer" }}>
                  <input type="radio" name="visitMode" value="in-person" checked={visitMode === "in-person"} onChange={() => setVisitMode("in-person")} />
                  <span>In Person</span>
                </label>
                <label className="radio" style={{ margin: 0, padding: "var(--sp-3)", border: visitMode === "telehealth" ? "1.5px solid var(--sage-500)" : "1.5px solid var(--linen)", borderRadius: 6, background: "var(--warm-white)", cursor: "pointer" }}>
                  <input type="radio" name="visitMode" value="telehealth" checked={visitMode === "telehealth"} onChange={() => setVisitMode("telehealth")} />
                  <span>Telehealth</span>
                </label>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: "var(--sp-3)" }}>
              <label>Notes <span className="req">(optional)</span></label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any notes..." />
            </div>

            <div style={{ marginTop: "var(--sp-4)", display: "flex", justifyContent: "flex-end", gap: "var(--sp-3)" }}>
              <button type="button" className="btn-light btn-sm" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </button>
                  <button type="submit" className="btn-primary btn-sm" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
