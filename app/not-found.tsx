"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { House, MagnifyingGlass } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/10" />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-accent-purple/20">
          <MagnifyingGlass size={64} weight="bold" className="text-accent-purple" />
        </div>

        <h1 className="mb-4 text-6xl font-bold text-gradient">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Page introuvable
        </h2>
        <p className="mb-8 max-w-md text-gray-400">
          Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <Link href="/">
          <Button size="lg" icon={<House size={20} weight="fill" />}>
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
