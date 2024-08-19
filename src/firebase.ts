import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from "./config";

const firebaseConfig = getFirebaseConfig();
console.log("Firebase Config:", firebaseConfig); // Add this line for debugging

const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
