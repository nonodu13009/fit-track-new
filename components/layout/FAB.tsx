"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Barbell, ForkKnife, Scales, X } from "@phosphor-icons/react";
import { LogWorkoutModal } from "@/components/features/LogWorkoutModal";
import { LogWeightModal } from "@/components/features/LogWeightModal";
import { LogMeasurementsModal } from "@/components/features/LogMeasurementsModal";
import { LogMealModal } from "@/components/features/LogMealModal";

type ModalType = "workout" | "meal" | "weight" | "measurements" | null;

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const actions = [
    {
      label: "Séance rapide",
      icon: Barbell,
      onClick: () => openModal("workout"),
      color: "purple" as const,
    },
    {
      label: "Repas rapide",
      icon: ForkKnife,
      onClick: () => openModal("meal"),
      color: "cyan" as const,
    },
    {
      label: "Poids / mesures",
      icon: Scales,
      onClick: () => openModal("weight"),
      color: "lime" as const,
    },
  ];

  const colorClasses = {
    purple: "bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30",
    cyan: "bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30",
    lime: "bg-accent-lime/20 text-accent-lime hover:bg-accent-lime/30",
  };

  return (
    <>
      {/* Overlay pour fermer le menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[45] bg-deep-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-4">
        {/* Actions Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={action.onClick}
                    className={`glass flex items-center gap-3 rounded-full py-3 pl-4 pr-5 transition-all ${colorClasses[action.color]}`}
                  >
                    <Icon size={20} weight="bold" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent-purple to-indigo-600 shadow-glow-purple transition-all hover:shadow-glow-purple/80"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X size={28} weight="bold" className="text-white" />
            ) : (
              <Plus size={28} weight="bold" className="text-white" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Modals */}
      <LogWorkoutModal
        isOpen={activeModal === "workout"}
        onClose={closeModal}
      />
      <LogMealModal isOpen={activeModal === "meal"} onClose={closeModal} />
      <LogWeightModal isOpen={activeModal === "weight"} onClose={closeModal} />
      <LogMeasurementsModal
        isOpen={activeModal === "measurements"}
        onClose={closeModal}
      />
    </>
  );
}
