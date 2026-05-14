"use client";

type BadgeType = "next" | "telehealth" | "in-person" | "completed";

interface BadgeChipProps {
  type: BadgeType;
  label: string;
}

export function BadgeChip({ type, label }: BadgeChipProps) {
  return (
    <span className={`badge-chip badge-chip--${type}`}>
      {label}
    </span>
  );
}
