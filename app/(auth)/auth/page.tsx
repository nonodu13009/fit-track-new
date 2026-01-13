"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { GoogleLogo } from "@phosphor-icons/react";
import { Button, Input, InputPassword, Card } from "@/components/ui";
import {
  signUpSchema,
  signInSchema,
  type SignUpFormData,
  type SignInFormData,
} from "@/lib/validations/auth";
import { signUp, signIn, signInWithGoogle } from "@/lib/firebase/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignUp = mode === "signup";

  // Formulaire d'inscription
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Formulaire de connexion
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Soumission inscription
  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError("");

    try {
      await signUp(data.email, data.password);
      window.location.href = "/onboarding";
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Soumission connexion
  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError("");

    try {
      await signIn(data.email, data.password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/10" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent-purple/10 blur-3xl" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo / Retour */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-6 inline-block text-2xl font-bold text-gradient"
            >
              JJB Tracking
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-white">
              {isSignUp ? "Créer un compte" : "Se connecter"}
            </h1>
            <p className="text-gray-400">
              {isSignUp
                ? "Commencez votre parcours sportif"
                : "Bon retour parmi nous"}
            </p>
          </div>

          <Card variant="glass" className="p-6">
            {/* Toggle Mode */}
            <div className="mb-6 flex gap-2 rounded-lg bg-surface p-1">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  !isSignUp
                    ? "bg-accent-purple text-white shadow-glow-purple"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  isSignUp
                    ? "bg-accent-purple text-white shadow-glow-purple"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Form Inscription */}
            {isSignUp && (
              <form
                onSubmit={signUpForm.handleSubmit(onSignUp)}
                className="space-y-4"
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  error={signUpForm.formState.errors.email?.message}
                  {...signUpForm.register("email")}
                />

                <InputPassword
                  label="Mot de passe"
                  placeholder="••••••••"
                  error={signUpForm.formState.errors.password?.message}
                  {...signUpForm.register("password")}
                />

                <InputPassword
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  error={signUpForm.formState.errors.confirmPassword?.message}
                  {...signUpForm.register("confirmPassword")}
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Créer mon compte
                </Button>
              </form>
            )}

            {/* Form Connexion */}
            {!isSignUp && (
              <form
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-4"
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  error={signInForm.formState.errors.email?.message}
                  {...signInForm.register("email")}
                />

                <InputPassword
                  label="Mot de passe"
                  placeholder="••••••••"
                  error={signInForm.formState.errors.password?.message}
                  {...signInForm.register("password")}
                />

                <div className="text-right">
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-accent-cyan hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Se connecter
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-gray-500">ou</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Sign In */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              icon={<GoogleLogo size={20} weight="bold" />}
            >
              Continuer avec Google
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
