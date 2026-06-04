"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import type { AuthUser } from "@/lib/auth-api";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12 12 4l9 8" /><path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  user: AuthUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    if (!confirm("Sign out of the admin panel?")) return;
    await logout();
    router.push("/login");
  };

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("") || user.email[0].toUpperCase();

  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.email;

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--warm-white)",
        borderRight: "1px solid var(--linen)",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--linen)" }}>
        <Link href="/admin" style={{ display: "inline-flex" }}>
          <Image src="/logo.svg" alt="MindEd Connections" width={110} height={40} priority />
        </Link>
        <div style={{ marginTop: "0.625rem", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-500)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }} aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.5rem 0.75rem",
                borderRadius: 6,
                fontSize: "0.875rem",
                color: isActive ? "var(--sage-600)" : "var(--stone-700)",
                background: isActive ? "var(--sage-50)" : "transparent",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                transition: "background 150ms, color 150ms",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "1rem 1.25rem 0", borderTop: "1px solid var(--linen)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--sage-100)", color: "var(--sage-700)", fontSize: "0.8125rem", fontFamily: "var(--font-display)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {initials}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.8125rem", color: "var(--ink)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--stone-500)" }}>Administrator</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ width: "100%", padding: "0.45rem 0", background: "none", border: "none", fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-body)", cursor: "pointer", textAlign: "left" }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
