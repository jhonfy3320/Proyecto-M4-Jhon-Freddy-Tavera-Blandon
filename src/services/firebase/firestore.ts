
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./app";

// Instancia compartida de Cloud Firestore.
export const db = getFirestore(firebaseApp);
