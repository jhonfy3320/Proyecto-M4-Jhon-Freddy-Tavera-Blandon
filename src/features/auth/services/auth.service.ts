
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../../services/firebase/auth";

// Registrar un usuario con email y contraseña.
export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);

  await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

// Iniciar sesión con credenciales existentes.
export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);

  await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

// Cerrar la sesión activa.
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
