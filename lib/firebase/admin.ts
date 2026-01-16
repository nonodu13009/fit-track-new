/**
 * Firebase Admin SDK pour les routes API Next.js
 * 
 * L'Admin SDK bypass les règles Firestore et permet d'accéder aux données
 * depuis les routes API serveur sans authentification client.
 * 
 * ⚠️ IMPORTANT : Ne jamais utiliser côté client, uniquement dans les routes API !
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

/**
 * Initialiser Firebase Admin SDK
 */
function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  // Vérifier si déjà initialisé
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // Vérifier les variables d'environnement
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    throw new Error(
      "❌ Variables d'environnement Firebase Admin manquantes :\n" +
      "- FIREBASE_PRIVATE_KEY\n" +
      "- FIREBASE_CLIENT_EMAIL\n" +
      "\nVeuillez configurer ces variables dans Vercel (Settings > Environment Variables)"
    );
  }

  // Initialiser Admin SDK
  adminApp = initializeApp({
    credential: cert(serviceAccount as any),
    projectId: serviceAccount.projectId,
  });

  return adminApp;
}

/**
 * Obtenir l'instance Firestore Admin
 */
export function getAdminFirestore(): Firestore {
  if (adminDb) {
    return adminDb;
  }

  const app = getAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}

/**
 * Lire un document avec Admin SDK
 */
export async function adminGetDocument(
  collectionName: string,
  documentId: string
): Promise<any | null> {
  const db = getAdminFirestore();
  const docRef = db.collection(collectionName).doc(documentId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Requête avec filtres avec Admin SDK
 */
export async function adminQueryDocuments(
  collectionName: string,
  filters: Array<{ field: string; operator: any; value: any }>,
  orderByField?: string,
  orderDirection: "asc" | "desc" = "desc",
  limitCount?: number
): Promise<any[]> {
  const db = getAdminFirestore();
  let query: any = db.collection(collectionName);

  // Appliquer les filtres
  filters.forEach((filter) => {
    query = query.where(filter.field, filter.operator, filter.value);
  });

  // Appliquer orderBy si fourni
  if (orderByField) {
    query = query.orderBy(orderByField, orderDirection);
  }

  // Appliquer limit si fourni
  if (limitCount) {
    query = query.limit(limitCount);
  }

  const querySnapshot = await query.get();
  return querySnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Créer un document avec Admin SDK
 */
export async function adminCreateDocument(
  collectionName: string,
  documentId: string,
  data: any
): Promise<void> {
  const db = getAdminFirestore();
  const docRef = db.collection(collectionName).doc(documentId);
  await docRef.set({
    ...data,
    createdAt: new Date(),
  });
}

/**
 * Mettre à jour un document avec Admin SDK
 */
export async function adminUpdateDocument(
  collectionName: string,
  documentId: string,
  data: Partial<any>
): Promise<void> {
  const db = getAdminFirestore();
  const docRef = db.collection(collectionName).doc(documentId);
  await docRef.update(data);
}
