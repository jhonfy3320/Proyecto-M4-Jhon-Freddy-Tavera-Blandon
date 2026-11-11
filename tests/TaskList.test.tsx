// @vitest-environment jsdom

import "./setup";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";

import { TaskList } from "../src/features/tasks/components/TaskList";
import type { Task } from "../src/features/tasks/types/task";

const sampleDate = Timestamp.fromDate(
  new Date("2026-01-15T10:00:00.000Z")
);

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "tarea-1",
    userId: "usuario-1",
    title: "Revisar documentación",
    description: "Validar requisitos del proyecto",
    completed: false,
    createdAt: sampleDate,
    updatedAt: sampleDate,
    ...overrides,
  };
}

describe("TaskList - NexoTasks", () => {
  it("muestra estado vacío cuando no hay tareas", () => {
    render(
      <TaskList
        tasks={[]}
        busy={false}
        onUpdate={vi.fn().mockResolvedValue(true)}
        onDelete={vi.fn().mockResolvedValue(true)}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Aún no tienes tareas",
      })
    ).toBeInTheDocument();
  });

  it("renderiza la lista de tareas con su información", () => {
    const tasks = [
      buildTask(),
      buildTask({
        id: "tarea-2",
        title: "Desplegar en Vercel",
        description: "Configurar variables de entorno",
        completed: true,
      }),
    ];

    render(
      <TaskList
        tasks={tasks}
        busy={false}
        onUpdate={vi.fn().mockResolvedValue(true)}
        onDelete={vi.fn().mockResolvedValue(true)}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Revisar documentación",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Desplegar en Vercel",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pendiente")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Completada")
    ).toBeInTheDocument();
  });

  it("permite cambiar el estado de completado de una tarea", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(true);

    render(
      <TaskList
        tasks={[buildTask()]}
        busy={false}
        onUpdate={onUpdate}
        onDelete={vi.fn().mockResolvedValue(true)}
      />
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onUpdate).toHaveBeenCalledWith("tarea-1", {
      completed: true,
    });
  });

  it("permite editar una tarea existente", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(true);

    render(
      <TaskList
        tasks={[buildTask()]}
        busy={false}
        onUpdate={onUpdate}
        onDelete={vi.fn().mockResolvedValue(true)}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Editar",
      })
    );

    const titleInput = screen.getByLabelText(
      "Título de la tarea"
    );

    await user.clear(titleInput);
    await user.type(titleInput, "Documentación actualizada");

    await user.click(
      screen.getByRole("button", {
        name: "Guardar cambios",
      })
    );

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("tarea-1", {
        title: "Documentación actualizada",
        description: "Validar requisitos del proyecto",
      });
    });
  });

  it("solicita confirmación antes de eliminar una tarea", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(true);

    render(
      <TaskList
        tasks={[buildTask()]}
        busy={false}
        onUpdate={vi.fn().mockResolvedValue(true)}
        onDelete={onDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Eliminar",
      })
    );

    expect(
      screen.getByText(
        /¿Seguro que deseas eliminar esta tarea\?/i
      )
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Sí, eliminar",
      })
    );

    expect(onDelete).toHaveBeenCalledWith("tarea-1");
  });
});
