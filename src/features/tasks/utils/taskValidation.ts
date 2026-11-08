
import type { CreateTaskInput } from "../types/task";

export function normalizeTaskInput(
  input: CreateTaskInput
): CreateTaskInput {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
  };
}

export function validateTaskInput(
  input: CreateTaskInput
): string | null {
  const { title, description } = normalizeTaskInput(input);

  if (!title) {
    return "El título de la tarea es obligatorio.";
  }

  if (title.length > 120) {
    return "El título no puede superar 120 caracteres.";
  }

  if (description.length > 2000) {
    return "La descripción no puede superar 2000 caracteres.";
  }

  return null;
}
