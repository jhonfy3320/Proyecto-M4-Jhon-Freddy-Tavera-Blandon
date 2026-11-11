
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Limpiar el DOM después de cada prueba de React.
// Las pruebas ejecutadas en Node no necesitan DOM.
afterEach(() => {
  if (typeof document !== "undefined") {
    cleanup();
  }
});
