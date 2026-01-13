"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { Button, Input, Card } from "@/components/ui";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { resetPassword } from "@/lib/firebase/auth";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await resetPassword(data.email);
      setSuccess(true);
      form.reset();
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

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/auth"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} weight="bold" />
              Retour à la connexion
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-400">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <Card variant="glass" className="p-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4"
              >
                <CheckCircle
                  size={24}
                  weight="fill"
                  className="shrink-0 text-green-400"
                />
                <div>
                  <p className="font-medium text-green-400">
                    Email envoyé !
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Vérifiez votre boîte mail pour réinitialiser votre mot de
                    passe.
                  </p>
                </div>
              </motion.div>
            )}

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

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                error={form.formState.errors.email?.message}
                {...form.register("email")}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
