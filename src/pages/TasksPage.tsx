import { useState } from "react";

import { useAuth } from "../features/auth/hooks/useAuth";
import { logoutUser } from "../features/auth/services/auth.service";
import { getAuthErrorMessage } from "../features/auth/utils/authErrors";

export function TasksPage() {
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setSubmitting(true);
    setError(null);

    try {
      await logoutUser();
    } catch (cause: unknown) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="main-content">
      <div className="container">
        <section className="tasks-welcome">
          <h1>Mis tareas</h1>

          <p>
            Bienvenido a tu espacio personal de organización en
            NexoTasks.
          </p>

          <p className="auth-identity">
            <strong>Sesión activa:</strong>{" "}
            {user?.email ?? "Usuario autenticado"}
          </p>

          <p>
            La gestión de tareas estará disponible cuando implementemos
            el CRUD con Firestore.
          </p>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            className="auth-button logout-button"
            onClick={handleLogout}
            disabled={submitting}
          >
            {submitting ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </section>
      </div>
    </main>
  );
}