import { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { FAB } from "@/components/layout/FAB";
import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-deep-black pb-28 sm:pb-4">
        {/* Container principal avec padding adaptatif */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Floating Action Button */}
        <FAB />
      </div>
    </ProtectedRoute>
  );
}
