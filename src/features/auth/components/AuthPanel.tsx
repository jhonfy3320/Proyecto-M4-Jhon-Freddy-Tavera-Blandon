import { useState, type FormEvent } from "react";

import { useAuth } from "../hooks/useAuth";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.service";
import {
  validateAuthInput,
  type AuthMode,
} from "../utils/authValidation";
import { getAuthErrorMessage } from "../utils/authErrors";

export function AuthPanel() {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateAuthInput(
      mode,
      email,
      password,
      confirmPassword
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "register") {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }

      setPassword("");
      setConfirmPassword("");
    } catch (cause: unknown) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setError(null);

    try {
      await logoutUser();
      setPassword("");
      setConfirmPassword("");
    } catch (cause: unknown) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }

  if (loading) {
    return (
      <section className="auth-panel" role="status">
        Verificando sesión...
      </section>
    );
  }

  if (user) {
    return (
      <section className="auth-panel">
        <h2>Bienvenido a NexoTasks</h2>

        <p className="auth-description">
          Has iniciado sesión correctamente.
        </p>

        <p className="auth-identity">
          <strong>Usuario:</strong> {user.email}
        </p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="auth-button"
          onClick={handleLogout}
          disabled={submitting}
        >
          {submitting ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </section>
    );
  }

  const isRegister = mode === "register";

  return (
    <section className="auth-panel" aria-labelledby="auth-title">
      <h2 id="auth-title">
        {isRegister ? "Crear una cuenta" : "Iniciar sesión"}
      </h2>

      <p className="auth-description">
        {isRegister
          ? "Regístrate para comenzar a organizar tus tareas."
          : "Accede a tu cuenta de NexoTasks."}
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="auth-email">Correo electrónico</label>

        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="auth-password">Contraseña</label>

        <input
          id="auth-password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {isRegister && (
          <>
            <label htmlFor="auth-confirm-password">
              Confirmar contraseña
            </label>

            <input
              id="auth-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={submitting}
        >
          {submitting
            ? "Procesando..."
            : isRegister
              ? "Crear cuenta"
              : "Iniciar sesión"}
        </button>
      </form>

      <div className="auth-switch">
        <span>
          {isRegister
            ? "¿Ya tienes una cuenta?"
            : "¿Todavía no tienes cuenta?"}
        </span>

        <button
          type="button"
          onClick={changeMode}
          disabled={submitting}
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </button>
      </div>
    </section>
  );
}