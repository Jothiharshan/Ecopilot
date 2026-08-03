import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

const firebaseApp = initializeApp(firebaseConfigJson);
export const db = firebaseConfigJson.firestoreDatabaseId
  ? getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(firebaseApp);

export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    await getDoc(doc(db, "test", "connection"));
    console.log("🔥 Server verified connection to Firestore database:", firebaseConfigJson.firestoreDatabaseId || firebaseConfigJson.projectId);
    return true;
  } catch (err) {
    console.warn("Firestore connection check info:", err);
    return false;
  }
}

export interface FactoryDoc {
  id: string;
  name: string;
  location: string;
  industryType: string;
  numberOfMachines: number;
  numberOfEmployees: number;
  createdAt: string;
}

export interface DailyRecordDoc {
  id: string;
  factoryId: string;
  date: string;
  electricityKwh: number;
  waterLiters: number;
  productionOutput: number;
  workingHours: number;
  machineUtilization: number;
  maintenanceCost: number;
  operatingCost: number;
}

export async function getFactoriesFromStore(): Promise<FactoryDoc[]> {
  try {
    const snap = await getDocs(collection(db, "factories"));
    const list: FactoryDoc[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as FactoryDoc);
    });
    return list;
  } catch (err) {
    console.error("Error fetching factories from Firestore:", err);
    return [];
  }
}

function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function saveFactoryToStore(factory: FactoryDoc): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(factory);
    await setDoc(doc(db, "factories", factory.id), cleanData);
  } catch (err) {
    console.error("Error saving factory to Firestore:", err);
  }
}

export async function deleteFactoryFromStore(factoryId: string): Promise<void> {
  try {
    const recordsSnap = await getDocs(collection(db, "factories", factoryId, "records"));
    if (!recordsSnap.empty) {
      const batch = writeBatch(db);
      recordsSnap.forEach((rSnap) => {
        batch.delete(rSnap.ref);
      });
      await batch.commit();
    }
    await deleteDoc(doc(db, "factories", factoryId));
  } catch (err) {
    console.error("Error deleting factory from Firestore:", err);
  }
}

export async function getRecordsFromStore(factoryId: string): Promise<DailyRecordDoc[]> {
  try {
    const snap = await getDocs(collection(db, "factories", factoryId, "records"));
    const list: DailyRecordDoc[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as DailyRecordDoc);
    });
    return list;
  } catch (err) {
    console.error("Error fetching records from Firestore:", err);
    return [];
  }
}

export async function saveRecordToStore(factoryId: string, record: DailyRecordDoc): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(record);
    await setDoc(doc(db, "factories", factoryId, "records", record.id), cleanData);
  } catch (err) {
    console.error("Error saving record to Firestore:", err);
  }
}

export async function saveRecordsBatchToStore(factoryId: string, records: DailyRecordDoc[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const rec of records) {
      const ref = doc(db, "factories", factoryId, "records", rec.id);
      batch.set(ref, sanitizeForFirestore(rec));
    }
    await batch.commit();
  } catch (err) {
    console.error("Error saving batch records to Firestore:", err);
  }
}

export async function deleteRecordFromStore(factoryId: string, recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "factories", factoryId, "records", recordId));
  } catch (err) {
    console.error("Error deleting record from Firestore:", err);
  }
}

export interface UserDoc {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role?: string;
  companyName?: string;
  passwordHash?: string;
  token?: string;
  factoryIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordResetTokenDoc {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
  createdAt: string;
}

export async function getUsersFromStore(): Promise<UserDoc[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    const list: UserDoc[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserDoc);
    });
    return list;
  } catch (err) {
    console.error("Error fetching users from Firestore:", err);
    return [];
  }
}

export async function saveUserToStore(user: UserDoc): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(user);
    await setDoc(doc(db, "users", user.id), cleanData);
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }
}

export async function saveResetTokenToStore(tokenDoc: PasswordResetTokenDoc): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(tokenDoc);
    await setDoc(doc(db, "passwordResetTokens", tokenDoc.id), cleanData);
  } catch (err) {
    console.error("Error saving reset token to Firestore:", err);
  }
}

export async function getResetTokensFromStore(): Promise<PasswordResetTokenDoc[]> {
  try {
    const snap = await getDocs(collection(db, "passwordResetTokens"));
    const list: PasswordResetTokenDoc[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as PasswordResetTokenDoc);
    });
    return list;
  } catch (err) {
    console.error("Error fetching reset tokens from Firestore:", err);
    return [];
  }
}
