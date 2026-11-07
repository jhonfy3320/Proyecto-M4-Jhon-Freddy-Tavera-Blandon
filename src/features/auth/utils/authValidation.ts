
export type AuthMode = "login" | "register";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthInput(
  mode: AuthMode,
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }

  if (!password) {
    return "La contraseña es obligatoria.";
  }

  if (mode === "register") {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
  }

  return null;
}
