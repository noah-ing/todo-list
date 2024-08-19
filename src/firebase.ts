import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Enable multi-tab persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn(
      "Multiple tabs open, persistence can only be enabled in one tab at a time.",
    );
  } else if (err.code === "unimplemented") {
    console.warn(
      "The current browser does not support all of the features required to enable persistence",
    );
  }
});

export { db, auth, storage };
