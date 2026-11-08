
import type { Timestamp } from "firebase/firestore";

// Tarea completa utilizada por la interfaz React.
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Datos almacenados dentro del documento Firestore.
// El ID existe como identificador del documento.
export type TaskDocument = Omit<Task, "id">;

// Información solicitada al crear una tarea.
// El propietario y las fechas se generan en el servicio.
export type CreateTaskInput = Pick<
  Task,
  "title" | "description"
>;

// Campos que podrán modificarse desde la aplicación.
export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "completed">
>;
