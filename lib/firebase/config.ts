import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Validation des variables d'environnement Firebase
function validateFirebaseEnv() {
  // En production, on vérifie seulement côté serveur pour éviter les erreurs côté client
  if (typeof window !== "undefined") {
    return; // Skip validation côté client (les variables sont déjà injectées au build)
  }

  const requiredVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const errorMessage = `❌ Variables d'environnement Firebase manquantes :\n${missingVars.join("\n")}\n\nVeuillez configurer ces variables dans Vercel (Settings > Environment Variables) ou dans votre fichier .env.local pour le développement.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Valider les variables d'environnement avant l'initialisation (côté serveur uniquement)
validateFirebaseEnv();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase app
function getFirebaseApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

// Export Firebase instances (lazy initialization)
export const app = getFirebaseApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
