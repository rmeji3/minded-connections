"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function PortalRootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading || !user) return;
    router.replace(user.role === "Provider" ? "/portal/provider" : "/portal/patient");
  }, [user, isLoading, router]);

  return null;
}
