
import { FirebaseError } from "firebase/app";

export function getTaskErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return "No tienes permiso para realizar esta operación.";

      case "unauthenticated":
        return "Tu sesión no es válida. Inicia sesión nuevamente.";

      case "unavailable":
        return "No se pudo conectar con Firestore. Revisa tu conexión.";

      case "not-found":
        return "La tarea solicitada ya no existe.";

      case "failed-precondition":
        return "La consulta requiere revisar la configuración o los índices de Firestore.";

      case "resource-exhausted":
        return "El servicio alcanzó un límite temporal. Intenta más tarde.";

      default:
        return "No fue posible completar la operación.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}
