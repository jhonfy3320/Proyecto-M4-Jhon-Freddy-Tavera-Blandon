
import { useState } from "react";

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "../types/task";

import { TaskForm } from "./TaskForm";

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onUpdate: (
    id: string,
    changes: UpdateTaskInput
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TaskItem({
  task,
  busy,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const createdDate = task.createdAt
    .toDate()
    .toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  async function handleEdit(
    input: CreateTaskInput
  ): Promise<boolean> {
    return onUpdate(task.id, input);
  }

  return (
    <article
      className={`task-card ${task.completed ? "is-complete" : ""}`}
    >
      <div className="task-card-header">
        <label className="task-check">
          <input
            type="checkbox"
            checked={task.completed}
            disabled={busy}
            onChange={() => {
              void onUpdate(task.id, {
                completed: !task.completed,
              });
            }}
          />

          <span>
            {task.completed ? "Completada" : "Pendiente"}
          </span>
        </label>

        <time dateTime={task.createdAt.toDate().toISOString()}>
          {createdDate}
        </time>
      </div>

      {editing ? (
        <TaskForm
          key={task.id}
          initial={{
            title: task.title,
            description: task.description,
          }}
          submitLabel="Guardar cambios"
          busy={busy}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <h3 className="task-title">{task.title}</h3>

          {task.description && (
            <p className="task-description">
              {task.description}
            </p>
          )}

          <div className="task-item-actions">
            <button
              type="button"
              className="task-button-secondary"
              disabled={busy}
              onClick={() => setEditing(true)}
            >
              Editar
            </button>

            <button
              type="button"
              className="task-button-danger"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar
            </button>
          </div>
        </>
      )}

      {confirmDelete && (
        <div className="delete-confirmation">
          <p>
            ¿Seguro que deseas eliminar esta tarea?
            Esta acción no se puede deshacer.
          </p>

          <div className="task-item-actions">
            <button
              type="button"
              className="task-button-danger"
              disabled={busy}
              onClick={() => {
                void onDelete(task.id);
              }}
            >
              Sí, eliminar
            </button>

            <button
              type="button"
              className="task-button-secondary"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
