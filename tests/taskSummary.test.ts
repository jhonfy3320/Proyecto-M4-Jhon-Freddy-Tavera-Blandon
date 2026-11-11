
import { describe, expect, it } from "vitest";

import {
  buildTaskSummary,
} from "../server/taskSummary";

describe("NexoTasks - Resumen por email", () => {
  it("calcula tareas completadas y pendientes", () => {
    const summary = buildTaskSummary([
      {
        title: "Preparar informe",
        description: "Revisar resultados",
        completed: false,
      },
      {
        title: "Enviar documentos",
        description: "",
        completed: true,
      },
      {
        title: "Revisar pendientes",
        description: "",
        completed: false,
      },
    ]);

    expect(summary).toContain("Total de tareas: 3");
    expect(summary).toContain("Completadas: 1");
    expect(summary).toContain("Pendientes: 2");
  });

  it("incluye el estado individual de las tareas", () => {
    const summary = buildTaskSummary([
      {
        title: "Preparar informe",
        description: "",
        completed: false,
      },
    ]);

    expect(summary).toContain(
      "[PENDIENTE] Preparar informe"
    );
  });

  it("permite generar un resumen sin tareas", () => {
    const summary = buildTaskSummary([]);

    expect(summary).toContain("Total de tareas: 0");
    expect(summary).toContain(
      "Todavía no tienes tareas registradas."
    );
  });
});
