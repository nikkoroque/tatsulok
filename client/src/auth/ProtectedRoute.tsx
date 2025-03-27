"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    action: string;
    resource: string;
  };
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (
      !isLoading &&
      requiredPermission &&
      !hasPermission(requiredPermission.action, requiredPermission.resource)
    ) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, hasPermission, router, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission.action, requiredPermission.resource)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}