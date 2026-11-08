import { useState } from "react";

import { useAuth } from "../features/auth/hooks/useAuth";
import { logoutUser } from "../features/auth/services/auth.service";
import { getAuthErrorMessage } from "../features/auth/utils/authErrors";
import { TaskForm } from "../features/tasks/components/TaskForm";
import { TaskList } from "../features/tasks/components/TaskList";
import { useTasks } from "../features/tasks/hooks/useTasks";

export function TasksPage() {
  const { user } = useAuth();
  const {
  tasks,
  loading,
  loadError,
  mutationError,
  isMutating,
  create,
  update,
  remove,
} = useTasks();

const completedCount = tasks.filter(
  (task) => task.completed
).length;

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
          Organiza tus actividades y mantén
          el control de tus pendientes.
        </p>

        <p className="auth-identity">
          <strong>Sesión activa:</strong>{" "}
          {user?.email ?? "Usuario autenticado"}
        </p>
      </section>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {mutationError && (
        <p className="auth-error" role="alert">
          {mutationError}
        </p>
      )}

      <div className="tasks-layout">
        <section
          className="task-panel"
          aria-labelledby="create-task-title"
        >
          <h2 id="create-task-title">
            Crear nueva tarea
          </h2>

          <p className="task-panel-description">
            Añade una actividad a tu lista personal.
          </p>

          <TaskForm
            submitLabel="Crear tarea"
            busy={
              isMutating ||
              loading ||
              Boolean(loadError)
            }
            onSubmit={create}
          />
        </section>

        <section
          className="task-panel"
          aria-labelledby="task-list-title"
        >
          <h2 id="task-list-title">
            Mi lista de tareas
          </h2>

          <p className="task-panel-description">
            {tasks.length} tareas en total ·{" "}
            {completedCount} completadas
          </p>

          {loading ? (
            <p role="status">
              Cargando tus tareas...
            </p>
          ) : loadError ? (
            <p className="auth-error" role="alert">
              {loadError}
            </p>
          ) : (
            <TaskList
              tasks={tasks}
              busy={isMutating}
              onUpdate={update}
              onDelete={remove}
            />
          )}
        </section>
      </div>

      <div className="tasks-footer">
        <button
          type="button"
          className="auth-button logout-button"
          onClick={handleLogout}
          disabled={submitting}
        >
          {submitting
            ? "Cerrando sesión..."
            : "Cerrar sesión"}
        </button>
      </div>
    </div>
  </main>
);
}
