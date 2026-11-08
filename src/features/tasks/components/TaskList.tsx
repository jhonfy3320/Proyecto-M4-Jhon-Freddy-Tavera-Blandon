
import type {
  Task,
  UpdateTaskInput,
} from "../types/task";

import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  busy: boolean;
  onUpdate: (
    id: string,
    changes: UpdateTaskInput
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TaskList({
  tasks,
  busy,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="tasks-empty">
        <h3>Aún no tienes tareas</h3>

        <p>
          Crea tu primera tarea para comenzar
          a organizar tus actividades.
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          busy={busy}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
