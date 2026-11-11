
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  sendTaskSummaryEmail,
} from "../src/features/email/services/email.service";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Email Service - NexoTasks", () => {
  it("envía el token por Authorization", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        message: "Solicitud aceptada.",
        totalTasks: 3,
      })
    );

    const result = await sendTaskSummaryEmail(
      "firebase-token-prueba"
    );

    expect(fetchMock).toHaveBeenCalledOnce();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/send-task-summary",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer firebase-token-prueba",
        },
      }
    );

    expect(result.totalTasks).toBe(3);
  });

  it("no envía tareas ni destinatarios", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        message: "Solicitud aceptada.",
        totalTasks: 1,
      })
    );

    await sendTaskSummaryEmail("token");

    const [, options] = fetchMock.mock.calls[0];

    expect(options?.body).toBeUndefined();
  });

  it("muestra el error recibido del servidor", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        {
          error:
            "Alcanzaste el límite de envíos.",
        },
        { status: 429 }
      )
    );

    await expect(
      sendTaskSummaryEmail("token")
    ).rejects.toThrow(
      "Alcanzaste el límite de envíos."
    );
  });

  it("rechaza respuestas inválidas", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>Error</html>", {
        status: 502,
        headers: {
          "Content-Type": "text/html",
        },
      })
    );

    await expect(
      sendTaskSummaryEmail("token")
    ).rejects.toThrow(
      "El servidor devolvió una respuesta inesperada."
    );
  });
});
