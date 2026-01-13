"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingOverlay } from "@/components/ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/auth");
    }
  }, [user, loading, router, isRedirecting]);

  // Afficher le contenu si user est présent, même pendant loading
  // Cela évite le blocage et améliore la perception de vitesse
  if (user) {
    return <>{children}</>;
  }

  // Si en train de rediriger ou loading
  if (loading || isRedirecting) {
    return <LoadingOverlay />;
  }

  // Aucun user et pas en loading = redirection en cours
  return null;
}
