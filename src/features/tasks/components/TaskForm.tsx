
import { useId, useState, type FormEvent } from "react";

import type { CreateTaskInput } from "../types/task";
import { validateTaskInput } from "../utils/taskValidation";

interface TaskFormProps {
  initial?: CreateTaskInput;
  submitLabel: string;
  busy: boolean;
  onSubmit: (input: CreateTaskInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function TaskForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const formId = useId();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError(null);

    const input = {
      title: title.trim(),
      description: description.trim(),
    };

    const validationError = validateTaskInput(input);

    if (validationError) {
      setError(validationError);
      return;
    }

    const success = await onSubmit(input);

    if (success) {
      if (initial) {
        onCancel?.();
      } else {
        setTitle("");
        setDescription("");
      }
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`${formId}-title`}>
        Título de la tarea
      </label>

      <input
        id={`${formId}-title`}
        type="text"
        placeholder="Ej. Preparar informe semanal"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={120}
        required
        disabled={busy}
      />

      <label htmlFor={`${formId}-description`}>
        Descripción
      </label>

      <textarea
        id={`${formId}-description`}
        placeholder="Describe los detalles de la tarea..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={2000}
        rows={4}
        disabled={busy}
      />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <div className="task-form-actions">
        <button
          type="submit"
          className="auth-button"
          disabled={busy}
        >
          {busy ? "Guardando..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            className="task-button-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
