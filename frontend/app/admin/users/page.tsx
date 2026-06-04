"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { UserRoleBadge } from "@/components/admin/user-role-badge";
import { Pagination } from "@/components/admin/pagination";
import type { UserRole } from "@/lib/users-api";

const PAGE_SIZE = 20;
const ROLES: { label: string; value: UserRole | "" }[] = [
  { label: "All roles",  value: ""         },
  { label: "Patient",    value: "Patient"  },
  { label: "Provider",   value: "Provider" },
  { label: "Admin",      value: "Admin"    },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const page   = Number(searchParams.get("page")   ?? 1);
  const role   = (searchParams.get("role")  ?? "") as UserRole | "";
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = React.useState(search);
  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, isLoading, isError } = useUsers({ page, pageSize: PAGE_SIZE, role, search });
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    if (key !== "page") p.delete("page");
    router.push(`/admin/users?${p.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setParam("search", e.target.value), 400);
  };

  const handleDelete = (id: string, email: string) => {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return;
    deleteUser(id, {
      onSuccess: () => toast.success("User deleted", { description: email }),
      onError: () => toast.error("Failed to delete user", { description: email }),
    });
  };

  return (
    <div>
      <header className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: "1.5rem" }}>
        <div>
          <span className="eyebrow">Users</span>
          <h1 style={{ color: "var(--ink)", margin: "0.25rem 0 0" }}>All users</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/users/providers/new" className="btn-primary" style={{ fontSize: "0.875rem" }}>
            + Add provider
          </Link>
          <Link href="/admin/users/patients/new" className="btn-primary" style={{ fontSize: "0.875rem", background: "var(--warm-white)", color: "var(--ink)", border: "1.5px solid var(--linen)" }}>
            + Add patient
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3" style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 340 }}>
          <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--stone-400)", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={handleSearchChange}
            autoComplete="off"
            style={{ paddingLeft: "2.25rem", width: "100%" }}
          />
        </div>

        <div className="flex gap-1" style={{ background: "var(--warm-white)", border: "1.5px solid var(--linen)", borderRadius: 6, padding: "0.2rem" }}>
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setParam("role", r.value)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 4,
                border: "none",
                background: role === r.value ? "var(--sage-500)" : "transparent",
                color: role === r.value ? "white" : "var(--stone-600)",
                fontSize: "0.8125rem",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--linen)" }}>
                {["Name", "Email", "Role", "Joined", ""].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 500, color: "var(--stone-500)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--stone-400)", fontSize: "0.875rem" }}>Loading…</td></tr>
              )}
              {isError && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-error)", fontSize: "0.875rem" }}>Failed to load users.</td></tr>
              )}
              {data?.items.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--stone-400)", fontSize: "0.875rem" }}>No users found.</td></tr>
              )}
              {data?.items.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid var(--linen)", transition: "background 120ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--sage-100)", color: "var(--sage-700)", fontSize: "0.8125rem", fontFamily: "var(--font-display)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {(user.firstName ?? user.email)[0].toUpperCase()}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--stone-600)" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--stone-500)", whiteSpace: "nowrap", fontFamily: "var(--font-detail)" }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      disabled={isDeleting}
                      style={{ fontSize: "0.8125rem", color: "var(--color-error)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", padding: "0.25rem 0.5rem", borderRadius: 4, opacity: isDeleting ? 0.5 : 1 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--linen)" }}>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={(p) => setParam("page", String(p))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
