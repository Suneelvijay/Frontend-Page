 "use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If authentication is still loading, don't do anything yet
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // If specific roles are required and user doesn't have the right role
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "dealer":
          router.push("/dealer");
          break;
        default:
          router.push("/customer");
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname, allowedRoles]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB162B]"></div>
      </div>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}