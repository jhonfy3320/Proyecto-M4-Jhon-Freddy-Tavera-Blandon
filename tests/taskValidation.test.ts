
import { describe, expect, it } from "vitest";

import {
  normalizeTaskInput,
  validateTaskInput,
} from "../src/features/tasks/utils/taskValidation";

describe("Validaciones de tareas - NexoTasks", () => {
  it("acepta una tarea válida", () => {
    const result = validateTaskInput({
      title: "Preparar informe",
      description: "Revisar los pendientes",
    });

    expect(result).toBeNull();
  });

  it("rechaza títulos vacíos", () => {
    const result = validateTaskInput({
      title: "   ",
      description: "Descripción de prueba",
    });

    expect(result).not.toBeNull();
  });

  it("rechaza títulos superiores a 120 caracteres", () => {
    const result = validateTaskInput({
      title: "A".repeat(121),
      description: "",
    });

    expect(result).not.toBeNull();
  });

  it("rechaza descripciones superiores a 2000 caracteres", () => {
    const result = validateTaskInput({
      title: "Tarea válida",
      description: "A".repeat(2001),
    });

    expect(result).not.toBeNull();
  });

  it("elimina espacios al inicio y al final", () => {
    const result = normalizeTaskInput({
      title: "  Preparar informe  ",
      description: "  Revisar pendientes  ",
    });

    expect(result).toEqual({
      title: "Preparar informe",
      description: "Revisar pendientes",
    });
  });
});
