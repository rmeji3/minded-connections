"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading || !user) return;
    if (user.role !== "Provider") router.replace("/portal");
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "Provider") return null;

  return <>{children}</>;
}
