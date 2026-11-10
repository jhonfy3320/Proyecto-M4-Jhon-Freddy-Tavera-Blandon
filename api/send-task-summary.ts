
import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";

import { getAdminServices } from "../server/firebaseAdmin";
import {
  consumeEmailQuota,
  RateLimitError,
} from "../server/emailRateLimit";
import { buildTaskSummary } from "../server/taskSummary";

function jsonResponse(
  body: Record<string, unknown>,
  status: number
): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    // Solamente aceptamos solicitudes POST.
    if (request.method !== "POST") {
      return Response.json(
        { error: "Método no permitido." },
        {
          status: 405,
          headers: {
            Allow: "POST",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Este endpoint no necesita recibir tareas ni destinatarios.
    const contentLength = Number(
      request.headers.get("content-length") ?? "0"
    );

    if (contentLength > 0) {
      return jsonResponse(
        { error: "Esta operación no acepta datos adicionales." },
        400
      );
    }

    const authorization =
      request.headers.get("authorization") ?? "";

    const match = /^Bearer ([^\s]+)$/.exec(authorization);

    if (!match) {
      return jsonResponse(
        { error: "Debes iniciar sesión." },
        401
      );
    }

    let services: ReturnType<typeof getAdminServices>;

    try {
      services = getAdminServices();
    } catch {
      return jsonResponse(
        { error: "El servicio no está configurado." },
        503
      );
    }

    const { adminAuth, adminDb } = services;

    // Comprobación del token y su revocación.
    let uid: string;

    try {
      const decoded = await adminAuth.verifyIdToken(
        match[1],
        true
      );

      uid = decoded.uid;
    } catch {
      return jsonResponse(
        { error: "La sesión no es válida o ha expirado." },
        401
      );
    }

    // El destinatario procede de Firebase, no del cliente.
    let recipient: string;

    try {
      const account = await adminAuth.getUser(uid);

      if (!account.email || !account.emailVerified) {
        return jsonResponse(
          {
            error:
              "Debes verificar tu correo electrónico antes de solicitar el resumen.",
          },
          403
        );
      }

      recipient = account.email;
    } catch {
      return jsonResponse(
        { error: "No se pudo verificar la cuenta del usuario." },
        401
      );
    }

    const region = process.env.AWS_REGION;
    const sender = process.env.SES_FROM_EMAIL;

    if (
      !region ||
      !sender ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ) {
      return jsonResponse(
        { error: "El servicio de correo no está configurado." },
        503
      );
    }

    try {
      // Firebase Admin tiene privilegios administrativos.
      // Siempre filtramos mediante el UID verificado.
      const snapshot = await adminDb
        .collection("tasks")
        .where("userId", "==", uid)
        .get();

      const tasks = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          title:
            typeof data.title === "string"
              ? data.title
              : "Tarea sin título",

          description:
            typeof data.description === "string"
              ? data.description
              : "",

          completed: data.completed === true,
        };
      });

      const summary = buildTaskSummary(tasks);

      // Nunca enviamos un resumen recortado silenciosamente.
      if (Buffer.byteLength(summary, "utf8") > 100_000) {
        return jsonResponse(
          {
            error:
              "El resumen es demasiado extenso para enviarlo en un solo correo.",
          },
          413
        );
      }

      await consumeEmailQuota(adminDb, uid);

      const ses = new SESv2Client({
        region,
      });

      try {
        const result = await ses.send(
          new SendEmailCommand({
            FromEmailAddress: sender,
            Destination: {
              ToAddresses: [recipient],
            },
            Content: {
              Simple: {
                Subject: {
                  Data: "NexoTasks - Resumen de tareas",
                  Charset: "UTF-8",
                },
                Body: {
                  Text: {
                    Data: summary,
                    Charset: "UTF-8",
                  },
                },
              },
            },
          })
        );

        if (!result.MessageId) {
          throw new Error(
            "AWS SES no confirmó la aceptación del mensaje."
          );
        }
      } catch (error: unknown) {
        console.error(
          "Error de envío SES:",
          error instanceof Error
            ? error.name
            : "Error desconocido"
        );

        return jsonResponse(
          {
            error:
              "No fue posible enviar el correo. Verifica la configuración de AWS SES.",
          },
          502
        );
      } finally {
        ses.destroy();
      }

      return jsonResponse(
        {
          message: "AWS SES aceptó la solicitud de envío.",
          totalTasks: tasks.length,
        },
        200
      );
    } catch (error: unknown) {
      if (error instanceof RateLimitError) {
        return jsonResponse(
          { error: error.message },
          429
        );
      }

      console.error(
        "Error en el resumen:",
        error instanceof Error
          ? error.name
          : "Error desconocido"
      );

      return jsonResponse(
        {
          error:
            "Ocurrió un error al preparar el resumen de tareas.",
        },
        503
      );
    }
  },
};
