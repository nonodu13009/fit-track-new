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
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const errorCode = extractFirebaseErrorCode(error);
    const errorMessage = getAuthErrorMessage(errorCode);
    throw new Error(errorMessage);
  }
}

/**
 * Connexion avec email et mot de passe
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const errorCode = extractFirebaseErrorCode(error);
    const errorMessage = getAuthErrorMessage(errorCode);
    throw new Error(errorMessage);
  }
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
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const errorCode = extractFirebaseErrorCode(error);
    const errorMessage = getAuthErrorMessage(errorCode);
    throw new Error(errorMessage);
  }
}

/**
 * Connexion avec Google
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    const errorCode = extractFirebaseErrorCode(error);
    const errorMessage = getAuthErrorMessage(errorCode);
    throw new Error(errorMessage);
  }
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
    "auth/api-key-not-valid":
      "Erreur de configuration Firebase. La clé API n'est pas valide. Veuillez contacter le support.",
    "auth/invalid-api-key":
      "Erreur de configuration Firebase. La clé API n'est pas valide. Veuillez contacter le support.",
  };

  return errorMessages[errorCode] || "Une erreur est survenue.";
}

/**
 * Extrait le code d'erreur Firebase depuis une erreur
 */
export function extractFirebaseErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code: string }).code;
  }
  if (error instanceof Error) {
    // Parfois l'erreur est dans le message
    const message = error.message;
    const codeMatch = message.match(/auth\/[a-z-]+/);
    if (codeMatch) {
      return codeMatch[0];
    }
  }
  return "unknown";
}
