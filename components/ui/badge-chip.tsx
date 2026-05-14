"use client";
import { cn } from "@/lib/utils";

type BadgeType = "next" | "telehealth" | "in-person" | "completed";

interface BadgeChipProps {
  type: BadgeType;
  label: string;
}

const VARIANT: Record<BadgeType, string> = {
  next:        "bg-[var(--sage-700)] text-white",
  telehealth:  "bg-[var(--sage-50)] text-[var(--sage-700)] border-[var(--sage-200)]",
  "in-person": "bg-[var(--cream)] text-[var(--stone-600)] border-[var(--linen)]",
  completed:   "bg-[var(--cream)] text-[var(--stone-500)] border-[var(--linen)]",
};

export function BadgeChip({ type, label }: BadgeChipProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.625rem] font-medium tracking-[.1em] uppercase whitespace-nowrap border border-transparent",
      VARIANT[type]
    )}>
      {label}
    </span>
  );
}
