"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface PatientLayoutProps {
  children: React.ReactNode;
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading || !user) return;
    if (user.role !== "Patient") router.replace("/portal");
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "Patient") return null;

  return <>{children}</>;
}
