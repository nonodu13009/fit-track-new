"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, SignOut, GearSix } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";

export function DashboardHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">
          {getGreeting()} 👋
        </h1>
        <p className="mt-1 text-gray-400">
          Prêt pour une session d&apos;entraînement ?
        </p>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="glass flex items-center gap-2 rounded-full p-2 transition-all hover:shadow-glow-purple"
          aria-label="Menu utilisateur"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-purple/20">
            <User size={20} weight="fill" className="text-accent-purple" />
          </div>
          <span className="hidden text-sm text-gray-400 sm:block">
            Connecté
          </span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl shadow-2xl"
              >
                {/* User Info */}
                <div className="border-b border-white/10 p-4">
                  <p className="text-sm font-medium text-white">
                    {user?.email}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Compte actif
                  </p>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <User size={18} weight="bold" />
                    <span>Mon profil</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push("/dashboard/settings");
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <GearSix size={18} weight="bold" />
                    <span>Paramètres</span>
                  </button>

                  <div className="my-2 h-px bg-white/10" />

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <SignOut size={18} weight="bold" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
