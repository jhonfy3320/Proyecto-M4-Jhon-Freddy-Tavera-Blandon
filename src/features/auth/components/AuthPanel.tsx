
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  loginUser,
  registerUser,
} from "../services/auth.service";

import {
  validateAuthInput,
  type AuthMode,
} from "../utils/authValidation";

import { getAuthErrorMessage } from "../utils/authErrors";

interface AuthPanelProps {
  mode: AuthMode;
}

export function AuthPanel({ mode }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
      if (isRegister) {
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

  return (
    <section
      className="auth-panel"
      aria-labelledby="auth-title"
    >
      <h1 id="auth-title">
        {isRegister ? "Crear una cuenta" : "Iniciar sesión"}
      </h1>

      <p className="auth-description">
        {isRegister
          ? "Regístrate para comenzar a organizar tus tareas."
          : "Accede a tu cuenta de NexoTasks."}
      </p>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <label htmlFor="auth-email">
          Correo electrónico
        </label>

        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <label htmlFor="auth-password">
          Contraseña
        </label>

        <input
          id="auth-password"
          type="password"
          autoComplete={
            isRegister ? "new-password" : "current-password"
          }
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
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
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
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

        {submitting ? (
          <span>
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </span>
        ) : (
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </Link>
        )}
      </div>
    </section>
  );
}
