"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }
    if (user.role !== "Admin") {
      router.replace("/portal");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user || user.role !== "Admin") return null;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--cream)" }}>
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto" style={{ padding: "clamp(1.5rem,4vw,2.5rem)" }}>
        {children}
      </main>
    </div>
  );
}
