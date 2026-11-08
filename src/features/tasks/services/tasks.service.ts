
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../../../services/firebase/firestore";

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "../types/task";

import {
  normalizeTaskInput,
  validateTaskInput,
} from "../utils/taskValidation";

// Colección compartida, protegida por userId y Security Rules.
const tasksCollection = collection(db, "tasks");

// Suscripción de tareas del usuario autenticado.
export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const userTasksQuery = query(
    tasksCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    userTasksQuery,
    (snapshot) => {
      try {
        const tasks: Task[] = snapshot.docs.map((item) => {
          const data = item.data({
            serverTimestamps: "estimate",
          });

          // Comprobación de los datos recibidos.
          if (
            typeof data.userId !== "string" ||
            typeof data.title !== "string" ||
            typeof data.description !== "string" ||
            typeof data.completed !== "boolean" ||
            !(data.createdAt instanceof Timestamp) ||
            !(data.updatedAt instanceof Timestamp)
          ) {
            throw new Error(
              `El documento ${item.id} tiene datos inválidos.`
            );
          }

          return {
            id: item.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        onData(tasks);
      } catch (error: unknown) {
        onError(error);
      }
    },
    onError
  );
}

// CREATE: crear una tarea para el usuario autenticado.
export async function createTask(
  userId: string,
  input: CreateTaskInput
): Promise<void> {
  const error = validateTaskInput(input);

  if (error) {
    throw new Error(error);
  }

  if (!userId) {
    throw new Error("Debes iniciar sesión para crear tareas.");
  }

  const data = normalizeTaskInput(input);

  await addDoc(tasksCollection, {
    userId,
    title: data.title,
    description: data.description,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// UPDATE: actualizar campos editables de una tarea.
export async function updateTask(
  taskId: string,
  changes: UpdateTaskInput
): Promise<void> {
  const updates: UpdateTaskInput = {};

  if (changes.title !== undefined) {
    const title = changes.title.trim();

    if (!title || title.length > 120) {
      throw new Error("El título debe tener entre 1 y 120 caracteres.");
    }

    updates.title = title;
  }

  if (changes.description !== undefined) {
    const description = changes.description.trim();

    if (description.length > 2000) {
      throw new Error("La descripción supera 2000 caracteres.");
    }

    updates.description = description;
  }

  if (changes.completed !== undefined) {
    updates.completed = changes.completed;
  }

  await updateDoc(doc(db, "tasks", taskId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// DELETE: eliminar una tarea por su ID.
export async function deleteTask(
  taskId: string
): Promise<void> {
  await deleteDoc(doc(db, "tasks", taskId));
}
