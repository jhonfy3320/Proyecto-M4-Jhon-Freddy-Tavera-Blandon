
import { getAuth } from "firebase/auth";
import { firebaseApp } from "./app";

// Instancia compartida de Firebase Authentication.
export const auth = getAuth(firebaseApp);
