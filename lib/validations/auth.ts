import { z } from "zod";

/**
 * Schéma de validation pour l'inscription
 */
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

/**
 * Schéma de validation pour la connexion
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

/**
 * Schéma de validation pour reset password
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
