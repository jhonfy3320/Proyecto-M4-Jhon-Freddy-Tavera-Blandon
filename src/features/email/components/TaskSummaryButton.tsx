
import { useState } from "react";

import {
  reload,
  sendEmailVerification,
} from "firebase/auth";

import { useAuth } from "../../auth/hooks/useAuth";

import { sendTaskSummaryEmail } from "../services/email.service";

export function TaskSummaryButton() {
  const { user } = useAuth();

  const [verified, setVerified] = useState(
    user?.emailVerified ?? false
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  async function handleVerificationEmail() {
    if (!user) return;

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      await sendEmailVerification(user);

      setSuccess(
        "Te enviamos un correo de verificación. Revisa tu bandeja de entrada."
      );
    } catch {
      setError(
        "No se pudo enviar el enlace de verificación. Intenta más tarde."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckVerification() {
    if (!user) return;

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      await reload(user);

      setVerified(user.emailVerified);

      if (user.emailVerified) {
        setSuccess("Tu correo electrónico está verificado.");
      } else {
        setError(
          "El correo aún no está verificado. Revisa el enlace recibido."
        );
      }
    } catch {
      setError(
        "No fue posible comprobar la verificación."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSendSummary() {
    if (!user) return;

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      await reload(user);
      setVerified(user.emailVerified);

      if (!user.emailVerified) {
        throw new Error(
          "Primero debes verificar tu correo electrónico."
        );
      }

      const idToken = await user.getIdToken(true);

      const result = await sendTaskSummaryEmail(idToken);

      setSuccess(
        `${result.message} Tareas incluidas: ${result.totalTasks}.`
      );
    } catch (cause: unknown) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No fue posible enviar el resumen."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="email-summary">
      <p className="email-recipient">
        <strong>Destinatario:</strong> {user.email}
      </p>

      {!verified && (
        <div className="email-verification">
          <p>
            Para enviar el resumen, primero debes
            verificar tu correo de Firebase.
          </p>

          <div className="email-actions">
            <button
              type="button"
              className="task-button-secondary"
              onClick={handleVerificationEmail}
              disabled={busy}
            >
              Enviar enlace de verificación
            </button>

            <button
              type="button"
              className="task-button-secondary"
              onClick={handleCheckVerification}
              disabled={busy}
            >
              Ya verifiqué mi correo
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="auth-button email-send-button"
        onClick={handleSendSummary}
        disabled={busy}
      >
        {busy
          ? "Procesando solicitud..."
          : "Enviar resumen por email"}
      </button>

      {success && (
        <p className="email-success" role="status">
          {success}
        </p>
      )}

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
