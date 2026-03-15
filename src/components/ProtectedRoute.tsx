"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const ADMIN_EMAILS = ["admin@roboonbd.com", "roboonbd@gmail.com"];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirected=true");
      } else if (!user.emailVerified && !ADMIN_EMAILS.includes(user.email || "")) {
        // If the user's email is not verified and they are not an admin, redirect back to login
        router.push("/login?unverified=true");
      } else if (requireAdmin && role !== 'admin' && role !== 'moderator') {
        // Only allow admin or moderator to access admin routes
        router.push("/dashboard");
      }
    }
  }, [user, role, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
