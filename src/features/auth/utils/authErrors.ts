
import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Ocurrió un error inesperado. Intenta nuevamente.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";

    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "El correo o la contraseña son incorrectos.";

    case "auth/email-already-in-use":
      return "No se pudo crear la cuenta. Si ya tienes una cuenta, inicia sesión.";

    case "auth/weak-password":
      return "La contraseña no cumple los requisitos de seguridad.";

    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";

    case "auth/network-request-failed":
      return "No hay conexión. Verifica tu internet.";

    case "auth/operation-not-allowed":
      return "El método de acceso no está habilitado en Firebase.";

    case "auth/unauthorized-domain":
      return "El dominio no está autorizado en Firebase.";

    default:
      return "No fue posible completar la operación.";
  }
}
