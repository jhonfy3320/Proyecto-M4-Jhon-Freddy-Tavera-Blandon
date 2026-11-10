
import {
  Timestamp,
  type Firestore,
} from "firebase-admin/firestore";

const MIN_INTERVAL_MS = 60_000;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function consumeEmailQuota(
  db: Firestore,
  uid: string
): Promise<void> {
  const ref = db
    .collection("emailSendLimits")
    .doc(uid);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();

    const now = Timestamp.now();
    const nowMs = now.toMillis();

    const lastAttempt =
      data?.lastAttemptAt instanceof Timestamp
        ? data.lastAttemptAt
        : null;

    if (
      lastAttempt &&
      nowMs - lastAttempt.toMillis() < MIN_INTERVAL_MS
    ) {
      throw new RateLimitError(
        "Espera al menos un minuto antes de solicitar otro correo."
      );
    }

    const previousWindow =
      data?.windowStartAt instanceof Timestamp
        ? data.windowStartAt
        : null;

    const sameWindow =
      previousWindow !== null &&
      nowMs - previousWindow.toMillis() < WINDOW_MS;

    const count =
      sameWindow && typeof data?.attemptCount === "number"
        ? data.attemptCount
        : 0;

    if (count >= MAX_ATTEMPTS) {
      throw new RateLimitError(
        "Alcanzaste el límite de envíos. Intenta más tarde."
      );
    }

    transaction.set(ref, {
      lastAttemptAt: now,
      windowStartAt: sameWindow
        ? previousWindow
        : now,
      attemptCount: count + 1,
    });
  });
}
