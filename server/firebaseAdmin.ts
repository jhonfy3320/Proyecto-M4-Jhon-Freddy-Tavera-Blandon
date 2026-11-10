
import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const APP_NAME = "nexotasks-server";

export function getAdminServices() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  const privateKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "La configuración privada de Firebase Admin está incompleta."
    );
  }

  const existingApp = getApps().find(
    (app) => app.name === APP_NAME
  );

  const app =
    existingApp ??
    initializeApp(
      {
        projectId,
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      },
      APP_NAME
    );

  return {
    adminAuth: getAuth(app),
    adminDb: getFirestore(app),
  };
}
