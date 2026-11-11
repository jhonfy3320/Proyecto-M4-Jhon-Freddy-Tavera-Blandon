// @vitest-environment jsdom

import "./setup";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { FirebaseError } from "firebase/app";

import { AuthPanel } from "../src/features/auth/components/AuthPanel";
import {
  loginUser,
  registerUser,
} from "../src/features/auth/services/auth.service";

// Sustituimos las operaciones reales de Firebase.
vi.mock(
  "../src/features/auth/services/auth.service",
  () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
  })
);

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(loginUser).mockResolvedValue(undefined);
  vi.mocked(registerUser).mockResolvedValue(undefined);
});

function renderAuthPanel(mode: "login" | "register") {
  return render(
    <MemoryRouter>
      <AuthPanel mode={mode} />
    </MemoryRouter>
  );
}

describe("AuthPanel - NexoTasks", () => {
  it("muestra el formulario de inicio de sesión", () => {
    renderAuthPanel("login");

    expect(
      screen.getByRole("heading", {
        name: "Iniciar sesión",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Correo electrónico")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Contraseña")
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText("Confirmar contraseña")
    ).not.toBeInTheDocument();
  });

  it("rechaza un correo inválido", async () => {
    const user = userEvent.setup();

    renderAuthPanel("login");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "correo-invalido"
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Iniciar sesión",
      })
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ingresa un correo electrónico válido."
    );

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("inicia sesión con credenciales válidas", async () => {
    const user = userEvent.setup();

    renderAuthPanel("login");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "usuario@ejemplo.com"
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Iniciar sesión",
      })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(
        "usuario@ejemplo.com",
        "Password123"
      );
    });
  });

  it("impide registrar contraseñas diferentes", async () => {
    const user = userEvent.setup();

    renderAuthPanel("register");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "nuevo@ejemplo.com"
    );

    await user.type(
      screen.getByLabelText("Contraseña", {
        exact: true,
      }),
      "Password123"
    );

    await user.type(
      screen.getByLabelText("Confirmar contraseña"),
      "Password456"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear cuenta",
      })
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Las contraseñas no coinciden."
    );

    expect(registerUser).not.toHaveBeenCalled();
  });

  it("registra una cuenta con datos válidos", async () => {
    const user = userEvent.setup();

    renderAuthPanel("register");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "nuevo@ejemplo.com"
    );

    await user.type(
      screen.getByLabelText("Contraseña", {
        exact: true,
      }),
      "Password123"
    );

    await user.type(
      screen.getByLabelText("Confirmar contraseña"),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear cuenta",
      })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(
        "nuevo@ejemplo.com",
        "Password123"
      );
    });
  });

  it("muestra un error de Firebase comprensible", async () => {
    const user = userEvent.setup();

    vi.mocked(loginUser).mockRejectedValue(
      new FirebaseError(
        "auth/invalid-credential",
        "Credenciales inválidas"
      )
    );

    renderAuthPanel("login");

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "usuario@ejemplo.com"
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "Incorrecta123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Iniciar sesión",
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "El correo o la contraseña son incorrectos."
    );
  });
});