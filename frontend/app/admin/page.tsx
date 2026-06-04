"use client";

import Link from "next/link";
import { useUserStats } from "@/hooks/use-users";

const QUICK_ACTIONS = [
  { label: "Add provider", href: "/admin/users/providers/new" },
  { label: "Add patient",  href: "/admin/users/patients/new"  },
  { label: "View all users", href: "/admin/users"             },
];

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "1.25rem 1.5rem",
        background: "var(--warm-white)",
        border: "1px solid var(--linen)",
        borderRadius: 10,
        textDecoration: "none",
      }}
    >
      <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", color: "var(--ink)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", marginTop: "0.4rem", fontFamily: "var(--font-body)" }}>
        {label}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useUserStats();

  const fmt = (n?: number) => (isLoading ? "…" : (n ?? 0));

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <span className="eyebrow">Admin</span>
        <h1 style={{ color: "var(--ink)", margin: "0.25rem 0 0" }}>Dashboard</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ marginBottom: "2rem" }}>
        <StatCard label="Total users"    value={fmt(stats?.total)}     href="/admin/users"                        />
        <StatCard label="Patients"       value={fmt(stats?.patients)}  href="/admin/users?role=Patient"           />
        <StatCard label="Providers"      value={fmt(stats?.providers)} href="/admin/users?role=Provider"          />
        <StatCard label="Administrators" value={fmt(stats?.admins)}    href="/admin/users?role=Admin"             />
      </div>

      <section style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10, padding: "1.5rem" }}>
        <h2 style={{ color: "var(--ink)", fontSize: "1.125rem", margin: "0 0 1rem" }}>Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} className="btn-primary" style={{ fontSize: "0.875rem" }}>
              {a.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
