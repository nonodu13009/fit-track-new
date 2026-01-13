import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

/**
 * Créer un document
 */
export async function createDocument(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

/**
 * Lire un document
 */
export async function getDocument(
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Mettre à jour un document
 */
export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data);
}

/**
 * Supprimer un document
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
}

/**
 * Requête avec filtres
 */
export async function queryDocuments(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Helpers pour les requêtes courantes
 */
export { where, orderBy, limit, Timestamp };
