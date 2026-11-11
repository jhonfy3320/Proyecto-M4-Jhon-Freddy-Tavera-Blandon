
interface EmailSummaryResponse {
  message: string;
  totalTasks: number;
}

export async function sendTaskSummaryEmail(
  idToken: string
): Promise<EmailSummaryResponse> {
  const response = await fetch("/api/send-task-summary", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta inesperada."
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    throw new Error(
      "La respuesta del servidor no es válida."
    );
  }

  const data = payload as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "No se pudo enviar el resumen."
    );
  }

  if (
    typeof data.message !== "string" ||
    typeof data.totalTasks !== "number"
  ) {
    throw new Error(
      "La confirmación del servidor es inválida."
    );
  }

  return {
    message: data.message,
    totalTasks: data.totalTasks,
  };
}
