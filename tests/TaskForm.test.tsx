
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

import { TaskForm } from "../src/features/tasks/components/TaskForm";

describe("TaskForm - NexoTasks", () => {
  it("rechaza títulos vacíos", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);

    render(
      <TaskForm
        submitLabel="Crear tarea"
        busy={false}
        onSubmit={onSubmit}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear tarea",
      })
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "El título de la tarea es obligatorio."
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía una tarea válida", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);

    render(
      <TaskForm
        submitLabel="Crear tarea"
        busy={false}
        onSubmit={onSubmit}
      />
    );

    await user.type(
      screen.getByLabelText("Título de la tarea"),
      "Preparar informe"
    );

    await user.type(
      screen.getByLabelText("Descripción"),
      "Revisar pendientes"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear tarea",
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Preparar informe",
        description: "Revisar pendientes",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText("Título de la tarea")
      ).toHaveValue("");
    });
  });

  it("conserva los datos si falla el guardado", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(false);

    render(
      <TaskForm
        submitLabel="Crear tarea"
        busy={false}
        onSubmit={onSubmit}
      />
    );

    await user.type(
      screen.getByLabelText("Título de la tarea"),
      "Tarea importante"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear tarea",
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(
      screen.getByLabelText("Título de la tarea")
    ).toHaveValue("Tarea importante");
  });

  it("deshabilita el formulario mientras guarda", () => {
    render(
      <TaskForm
        submitLabel="Crear tarea"
        busy={true}
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Guardando...",
      })
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Título de la tarea")
    ).toBeDisabled();
  });
});
