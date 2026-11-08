
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "../types/task";

import {
  createTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
} from "../services/tasks.service";

import { getTaskErrorMessage } from "../utils/taskErrors";

interface TaskState {
  userId: string | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const [state, setState] = useState<TaskState>({
    userId: null,
    tasks: [],
    loading: true,
    error: null,
  });

  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = subscribeToTasks(
      userId,
      (tasks) => {
        setState({
          userId,
          tasks,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          userId,
          tasks: [],
          loading: false,
          error: getTaskErrorMessage(error),
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // Nunca mostramos tareas de un UID anterior.
  const belongsToCurrentUser = state.userId === userId;

  const tasks = belongsToCurrentUser ? state.tasks : [];

  const loading = userId !== null &&
    (!belongsToCurrentUser || state.loading);

  const loadError = belongsToCurrentUser
    ? state.error
    : null;

  async function execute(
    operation: () => Promise<void>
  ): Promise<boolean> {
    setMutationError(null);
    setIsMutating(true);

    try {
      await operation();
      return true;
    } catch (error: unknown) {
      setMutationError(getTaskErrorMessage(error));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function create(
    input: CreateTaskInput
  ): Promise<boolean> {
    if (!userId) {
      setMutationError("Debes iniciar sesión.");
      return false;
    }

    return execute(() => createTask(userId, input));
  }

  async function update(
    taskId: string,
    changes: UpdateTaskInput
  ): Promise<boolean> {
    if (!userId) {
      setMutationError("Debes iniciar sesión.");
      return false;
    }

    return execute(() => updateTask(taskId, changes));
  }

  async function remove(
    taskId: string
  ): Promise<boolean> {
    if (!userId) {
      setMutationError("Debes iniciar sesión.");
      return false;
    }

    return execute(() => deleteTask(taskId));
  }

  return {
    tasks,
    loading,
    loadError,
    mutationError,
    isMutating,
    create,
    update,
    remove,
  };
}
