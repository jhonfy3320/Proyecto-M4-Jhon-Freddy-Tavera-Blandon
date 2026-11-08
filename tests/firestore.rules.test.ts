
import { readFileSync } from "node:fs";

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

let testEnv: RulesTestEnvironment;

const USER_A = "usuario-a";
const USER_B = "usuario-b";

const initialDate = Timestamp.fromDate(
  new Date("2026-01-01T00:00:00.000Z")
);

function newTask(userId: string) {
  return {
    userId,
    title: "Preparar informe",
    description: "Revisar las actividades pendientes",
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

async function seedTask(
  taskId: string,
  userId: string
) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "tasks", taskId),
      {
        userId,
        title: "Tarea de prueba",
        description: "Documento para validar seguridad",
        completed: false,
        createdAt: initialDate,
        updatedAt: initialDate,
      }
    );
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-nexotasks",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync(
        new URL("../firestore.rules", import.meta.url),
        "utf8"
      ),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

describe("Firestore Security Rules - NexoTasks", () => {
  it("permite crear tareas propias", async () => {
    const db = testEnv.authenticatedContext(USER_A).firestore();

    await assertSucceeds(
      setDoc(
        doc(db, "tasks", "tarea-a"),
        newTask(USER_A)
      )
    );
  });

  it("impide crear tareas a nombre de otro usuario", async () => {
    const db = testEnv.authenticatedContext(USER_A).firestore();

    await assertFails(
      setDoc(
        doc(db, "tasks", "tarea-falsa"),
        newTask(USER_B)
      )
    );
  });

  it("rechaza tareas con campos inválidos", async () => {
    const db = testEnv.authenticatedContext(USER_A).firestore();

    await assertFails(
      setDoc(doc(db, "tasks", "tarea-vacia"), {
        ...newTask(USER_A),
        title: "",
      })
    );

    await assertFails(
      setDoc(doc(db, "tasks", "tarea-extra"), {
        ...newTask(USER_A),
        isAdmin: true,
      })
    );
  });

  it("permite leer una tarea propia", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_A).firestore();

    const result = await assertSucceeds(
      getDoc(doc(db, "tasks", "tarea-a"))
    );

    expect(result.exists()).toBe(true);
  });

  it("impide leer documentos de otro usuario", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_B).firestore();

    await assertFails(
      getDoc(doc(db, "tasks", "tarea-a"))
    );
  });

  it("permite listar solo las tareas propias", async () => {
    await seedTask("tarea-a", USER_A);
    await seedTask("tarea-b", USER_B);

    const db = testEnv.authenticatedContext(USER_A).firestore();

    const ownTasks = query(
      collection(db, "tasks"),
      where("userId", "==", USER_A)
    );

    const result = await assertSucceeds(
      getDocs(ownTasks)
    );

    expect(result.size).toBe(1);

    await assertFails(
      getDocs(collection(db, "tasks"))
    );

    await assertFails(
      getDocs(
        query(
          collection(db, "tasks"),
          where("userId", "==", USER_B)
        )
      )
    );
  });

  it("permite actualizar una tarea propia", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_A).firestore();

    await assertSucceeds(
      updateDoc(doc(db, "tasks", "tarea-a"), {
        title: "Informe actualizado",
        completed: true,
        updatedAt: serverTimestamp(),
      })
    );
  });

  it("impide actualizar o eliminar tareas ajenas", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_B).firestore();
    const taskRef = doc(db, "tasks", "tarea-a");

    await assertFails(
      updateDoc(taskRef, {
        completed: true,
        updatedAt: serverTimestamp(),
      })
    );

    await assertFails(
      deleteDoc(taskRef)
    );
  });

  it("impide modificar propietario y fecha de creación", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_A).firestore();
    const taskRef = doc(db, "tasks", "tarea-a");

    await assertFails(
      updateDoc(taskRef, {
        userId: USER_B,
        updatedAt: serverTimestamp(),
      })
    );

    await assertFails(
      updateDoc(taskRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  it("permite al propietario eliminar su tarea", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.authenticatedContext(USER_A).firestore();

    await assertSucceeds(
      deleteDoc(doc(db, "tasks", "tarea-a"))
    );
  });

  it("rechaza accesos sin autenticación", async () => {
    await seedTask("tarea-a", USER_A);

    const db = testEnv.unauthenticatedContext().firestore();

    await assertFails(
      getDoc(doc(db, "tasks", "tarea-a"))
    );

    await assertFails(
      setDoc(
        doc(db, "tasks", "tarea-anonima"),
        newTask(USER_A)
      )
    );
  });
});
