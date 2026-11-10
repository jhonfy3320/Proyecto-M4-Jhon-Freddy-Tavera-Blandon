
export interface SummaryTask {
  title: string;
  description: string;
  completed: boolean;
}

export function buildTaskSummary(
  tasks: readonly SummaryTask[]
): string {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = total - completed;

  const details = tasks.length === 0
    ? "Todavía no tienes tareas registradas."
    : tasks
        .map((task, index) => {
          const status = task.completed
            ? "COMPLETADA"
            : "PENDIENTE";

          const title = task.title
            .replace(/\s+/g, " ")
            .trim();

          const description = task.description
            .replace(/\s+/g, " ")
            .trim();

          return [
            `${index + 1}. [${status}] ${title}`,
            description
              ? `   Descripción: ${description}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n");

  return [
    "NEXOTASKS — RESUMEN DE TAREAS",
    "",
    `Total de tareas: ${total}`,
    `Completadas: ${completed}`,
    `Pendientes: ${pending}`,
    "",
    "DETALLE DE ACTIVIDADES",
    "",
    details,
    "",
    "Este resumen fue solicitado desde NexoTasks.",
  ].join("\n");
}
