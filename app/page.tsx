"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Barbell, Brain, Calendar } from "@phosphor-icons/react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/10" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent-purple/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent-cyan/10 blur-3xl" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center"
        >
          {/* Logo / Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-6xl font-bold text-gradient md:text-7xl"
          >
            JJB Tracking
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-xl text-gray-400 md:text-2xl"
          >
            Journal + Planner + Coach IA
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 grid gap-6 md:grid-cols-3"
          >
            <div className="glass rounded-xl p-6">
              <Barbell size={32} weight="fill" className="mx-auto mb-3 text-accent-purple" />
              <h3 className="mb-2 font-semibold text-white">Journal</h3>
              <p className="text-sm text-gray-400">
                Logguez vos séances en 10 secondes
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <Calendar size={32} weight="fill" className="mx-auto mb-3 text-accent-cyan" />
              <h3 className="mb-2 font-semibold text-white">Planner</h3>
              <p className="text-sm text-gray-400">
                Planifiez votre semaine d&apos;entraînement
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <Brain size={32} weight="fill" className="mx-auto mb-3 text-accent-lime" />
              <h3 className="mb-2 font-semibold text-white">Coach IA</h3>
              <p className="text-sm text-gray-400">
                Conseils personnalisés par Mistral AI
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="shadow-glow-purple">
                Commencer
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="secondary" size="lg">
                Se connecter
              </Button>
            </Link>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="mb-2 text-sm font-semibold text-green-400">
              ✅ MVP Complet à 65%
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Auth ✓</span>
              <span>Journal ✓</span>
              <span>Agenda ✓</span>
              <span>Coach IA ✓</span>
              <span>Nutrition ✓</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
