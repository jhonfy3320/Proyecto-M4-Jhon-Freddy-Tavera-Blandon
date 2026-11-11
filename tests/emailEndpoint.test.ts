
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
  verifyIdToken: vi.fn(),
  getUser: vi.fn(),
  listTasks: vi.fn(),
  where: vi.fn(),
  quota: vi.fn(),
  sesSend: vi.fn(),
  sesDestroy: vi.fn(),
}));

vi.mock("../server/firebaseAdmin", () => ({
  getAdminServices: () => ({
    adminAuth: {
      verifyIdToken: mocks.verifyIdToken,
      getUser: mocks.getUser,
    },
    adminDb: {
      collection: (name: string) => ({
        where: (
          field: string,
          operator: string,
          value: string
        ) => {
          mocks.where(
            name,
            field,
            operator,
            value
          );

          return {
            get: mocks.listTasks,
          };
        },
      }),
    },
  }),
}));

vi.mock("../server/emailRateLimit", () => ({
  consumeEmailQuota: mocks.quota,

  RateLimitError: class RateLimitError extends Error {},
}));

vi.mock("@aws-sdk/client-sesv2", () => ({
  SESv2Client: class {
    send = mocks.sesSend;
    destroy = mocks.sesDestroy;
  },

  SendEmailCommand: class {
    constructor(public readonly input: unknown) {}
  },
}));

import handler from "../api/send-task-summary";

import {
  RateLimitError,
} from "../server/emailRateLimit";

function createRequest(
  method = "POST",
  token = "token-valido"
) {
  return new Request(
    "http://localhost/api/send-task-summary",
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  vi.stubEnv("AWS_REGION", "us-east-1");
  vi.stubEnv("AWS_ACCESS_KEY_ID", "clave-de-prueba");
  vi.stubEnv(
    "AWS_SECRET_ACCESS_KEY",
    "secreto-ficticio"
  );
  vi.stubEnv(
    "SES_FROM_EMAIL",
    "remitente@ejemplo.com"
  );

  mocks.verifyIdToken.mockResolvedValue({
    uid: "user-a",
  });

  mocks.getUser.mockResolvedValue({
    email: "usuario@ejemplo.com",
    emailVerified: true,
  });

  mocks.listTasks.mockResolvedValue({
    docs: [
      {
        data: () => ({
          title: "Preparar informe",
          description: "Revisar resultados",
          completed: false,
        }),
      },
    ],
  });

  mocks.quota.mockResolvedValue(undefined);

  mocks.sesSend.mockResolvedValue({
    MessageId: "mensaje-ses-prueba",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("API - Enviar resumen por email", () => {
  it("rechaza métodos distintos a POST", async () => {
    const response = await handler.fetch(
      createRequest("GET")
    );

    expect(response.status).toBe(405);

    expect(mocks.sesSend).not.toHaveBeenCalled();
  });

  it("rechaza solicitudes sin autenticación", async () => {
    const request = new Request(
      "http://localhost/api/send-task-summary",
      { method: "POST" }
    );

    const response = await handler.fetch(request);

    expect(response.status).toBe(401);
    expect(mocks.sesSend).not.toHaveBeenCalled();
  });

  it("rechaza tokens inválidos", async () => {
    mocks.verifyIdToken.mockRejectedValue(
      new Error("Token inválido")
    );

    const response = await handler.fetch(
      createRequest()
    );

    expect(response.status).toBe(401);
    expect(mocks.sesSend).not.toHaveBeenCalled();
  });

  it("rechaza cuentas con correo sin verificar", async () => {
    mocks.getUser.mockResolvedValue({
      email: "usuario@ejemplo.com",
      emailVerified: false,
    });

    const response = await handler.fetch(
      createRequest()
    );

    expect(response.status).toBe(403);
    expect(mocks.sesSend).not.toHaveBeenCalled();
  });

  it("consulta solo el UID verificado y envía al correo real", async () => {
    const response = await handler.fetch(
      createRequest()
    );

    expect(response.status).toBe(200);

    expect(mocks.where).toHaveBeenCalledWith(
      "tasks",
      "userId",
      "==",
      "user-a"
    );

    expect(mocks.sesSend).toHaveBeenCalledOnce();

    const command = mocks.sesSend.mock.calls[0][0] as {
      input: {
        Destination: {
          ToAddresses: string[];
        };
      };
    };

    expect(
      command.input.Destination.ToAddresses
    ).toEqual(["usuario@ejemplo.com"]);

    const data = await response.json();

    expect(data.totalTasks).toBe(1);
  });

  it("respeta el límite de envíos", async () => {
    mocks.quota.mockRejectedValue(
      new RateLimitError(
        "Alcanzaste el límite de envíos."
      )
    );

    const response = await handler.fetch(
      createRequest()
    );

    expect(response.status).toBe(429);
    expect(mocks.sesSend).not.toHaveBeenCalled();
  });

  it("maneja fallos de AWS SES", async () => {
    vi.spyOn(console, "error").mockImplementation(
      () => undefined
    );

    mocks.sesSend.mockRejectedValue(
      new Error("SES unavailable")
    );

    const response = await handler.fetch(
      createRequest()
    );

    expect(response.status).toBe(502);
  });

it("rechaza datos adicionales aunque no exista Content-Length", async () => {
  const request = new Request(
    "http://localhost/api/send-task-summary",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer token-valido",
      },
      body: JSON.stringify({
        recipient: "tercero@ejemplo.com",
      }),
    }
  );

  const response = await handler.fetch(request);

  expect(response.status).toBe(400);
  expect(mocks.sesSend).not.toHaveBeenCalled();
});
});
