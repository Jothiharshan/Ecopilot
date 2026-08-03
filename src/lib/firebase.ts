import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: config.apiKey || metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: config.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.appId || metaEnv.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID specified in config
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Validate Connection to Firestore on boot safely
export async function testFirestoreConnection() {
  try {
    await getDoc(doc(db, "test", "connection"));
    console.log("🔥 Connected to Firestore database:", config.firestoreDatabaseId || config.projectId);
  } catch (error) {
    if (error instanceof Error && error.message.includes("client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testFirestoreConnection();

export default app;
