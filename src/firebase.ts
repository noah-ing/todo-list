import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from "./config";

const firebaseConfig = getFirebaseConfig();
console.log("Firebase Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

const auth = getAuth(app);
const storage = getStorage(app);

// Add a custom sign-out function
const signOut = async () => {
  await firebaseSignOut(auth);
  // Clear any persistent auth state
  await auth.setPersistence('none');
};

export { db, auth, storage, signOut };
