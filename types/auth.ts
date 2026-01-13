/**
 * Types pour l'authentification
 */

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface AuthError {
  code: string;
  message: string;
}
