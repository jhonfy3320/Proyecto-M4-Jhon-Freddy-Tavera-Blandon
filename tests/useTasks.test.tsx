
// @vitest-environment jsdom

import "./setup";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  act,
  renderHook,
} from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { Task } from "../src/features/tasks/types/task";
import { useAuth } from "../src/features/auth/hooks/useAuth";
import {subscribeToTasks, createTask,} from "../src/features/tasks/services/tasks.service";
import { useTasks } from "../src/features/tasks/hooks/useTasks";

vi.mock("../src/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock(
  "../src/features/tasks/services/tasks.service",
  () => ({
    subscribeToTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  })
);

const unsubscribe = vi.fn();

const timestamp = Timestamp.fromDate(
  new Date("2026-11-01T10:00:00.000Z")
);

const sampleTask: Task = {
  id: "task-a",
  userId: "user-a",
  title: "Preparar informe",
  description: "",
  completed: false,
  createdAt: timestamp,
  updatedAt: timestamp,
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useAuth).mockReturnValue({
    user: { uid: "user-a" } as User,
    loading: false,
  });

  vi.mocked(subscribeToTasks).mockReturnValue(
    unsubscribe
  );

  vi.mocked(createTask).mockResolvedValue(undefined);
});

describe("useTasks - NexoTasks", () => {
  it("se suscribe a las tareas del usuario", () => {
    const { result } = renderHook(() => useTasks());

    expect(subscribeToTasks).toHaveBeenCalledWith(
      "user-a",
      expect.any(Function),
      expect.any(Function)
    );

    expect(result.current.loading).toBe(true);
  });

  it("actualiza el listado cuando llegan datos", () => {
    const { result } = renderHook(() => useTasks());

    const onData = vi.mocked(
      subscribeToTasks
    ).mock.calls[0][1];

    act(() => {
      onData([sampleTask]);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe(
      "Preparar informe"
    );
  });

  it("puede crear una tarea mediante el servicio", async () => {
    const { result } = renderHook(() => useTasks());

    let success = false;

    await act(async () => {
      success = await result.current.create({
        title: "Nueva tarea",
        description: "",
      });
    });

    expect(success).toBe(true);

    expect(createTask).toHaveBeenCalledWith(
      "user-a",
      {
        title: "Nueva tarea",
        description: "",
      }
    );
  });

  it("cancela la suscripción al desmontarse", () => {
    const { unmount } = renderHook(() => useTasks());

    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("no muestra tareas del usuario anterior", () => {
    const { result, rerender } = renderHook(
      () => useTasks()
    );

    const onData = vi.mocked(
      subscribeToTasks
    ).mock.calls[0][1];

    act(() => {
      onData([sampleTask]);
    });

    expect(result.current.tasks).toHaveLength(1);

    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "user-b" } as User,
      loading: false,
    });

    rerender();

    expect(unsubscribe).toHaveBeenCalled();
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.loading).toBe(true);
  });
});
