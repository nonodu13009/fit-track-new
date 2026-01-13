import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "./config";

/**
 * Inscription avec email et mot de passe
 */
export async function signUp(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

/**
 * Connexion avec email et mot de passe
 */
export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Reset password (envoi email)
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Connexion avec Google
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

/**
 * Messages d'erreur en français
 */
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Cet email est déjà utilisé.",
    "auth/invalid-email": "Email invalide.",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
    "auth/user-not-found": "Aucun compte trouvé avec cet email.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/too-many-requests":
      "Trop de tentatives. Réessayez dans quelques instants.",
    "auth/network-request-failed":
      "Erreur de connexion. Vérifiez votre réseau.",
  };

  return errorMessages[errorCode] || "Une erreur est survenue.";
}
