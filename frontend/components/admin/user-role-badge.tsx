import type { UserRole } from "@/lib/users-api";

const STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Admin:    { bg: "rgba(91,60,140,.08)",  color: "#5b3c8c", border: "rgba(91,60,140,.25)"  },
  Provider: { bg: "rgba(37,99,235,.07)",  color: "#1d4ed8", border: "rgba(37,99,235,.25)"  },
  Patient:  { bg: "var(--sage-50)",       color: "var(--sage-600)", border: "var(--sage-200)" },
};

const FALLBACK = { bg: "var(--linen)", color: "var(--stone-500)", border: "var(--stone-200)" };

interface UserRoleBadgeProps {
  role: UserRole | null | undefined;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const s = role ? (STYLES[role] ?? FALLBACK) : FALLBACK;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.6rem",
        borderRadius: 100,
        fontSize: "0.75rem",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {role ?? "—"}
    </span>
  );
}
