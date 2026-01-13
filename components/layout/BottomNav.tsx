"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { House, Notebook, Calendar, ChatCircle } from "@phosphor-icons/react";

const NAV_ITEMS = [
  {
    label: "Aujourd'hui",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Journal",
    href: "/dashboard/journal",
    icon: Notebook,
  },
  {
    label: "Agenda",
    href: "/dashboard/agenda",
    icon: Calendar,
  },
  {
    label: "Coach",
    href: "/dashboard/coach",
    icon: ChatCircle,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass flex items-center gap-2 rounded-full p-2 shadow-2xl"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative flex min-w-[4rem] flex-col items-center gap-1 rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-accent-purple/20 text-accent-purple"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {/* Icône */}
                <Icon
                  size={24}
                  weight={isActive ? "fill" : "bold"}
                  className="transition-transform"
                />

                {/* Label */}
                <span className="text-xs font-medium">{item.label}</span>

                {/* Indicateur actif */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -z-10 rounded-full bg-accent-purple/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
