"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    if (!user)                  { router.replace("/login?next=/portal"); return; }
    if (user.role === "Admin")  { router.replace("/admin");              return; }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role === "Admin") return null;

  return <>{children}</>;
}
