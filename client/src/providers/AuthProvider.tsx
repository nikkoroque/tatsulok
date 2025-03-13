"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux";
import { setCredentials } from "@/auth/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        dispatch(setCredentials(authData));
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("auth");
        router.push("/login");
      }
    }
  }, [dispatch, router]);

  return <>{children}</>;
}