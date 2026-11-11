
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
import type { User } from "firebase/auth";
import {
  reload,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "../src/features/auth/hooks/useAuth";
import { sendTaskSummaryEmail } from "../src/features/email/services/email.service";
import { TaskSummaryButton } from "../src/features/email/components/TaskSummaryButton";

vi.mock("../src/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  reload: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

vi.mock(
  "../src/features/email/services/email.service",
  () => ({
    sendTaskSummaryEmail: vi.fn(),
  })
);

const getIdToken = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  getIdToken.mockResolvedValue("token-prueba");

  vi.mocked(useAuth).mockReturnValue({
    user: {
      uid: "user-a",
      email: "usuario@ejemplo.com",
      emailVerified: true,
      getIdToken,
    } as unknown as User,
    loading: false,
  });

  vi.mocked(reload).mockResolvedValue(undefined);

  vi.mocked(sendEmailVerification).mockResolvedValue(
    undefined
  );

  vi.mocked(sendTaskSummaryEmail).mockResolvedValue({
    message: "AWS SES aceptó la solicitud de envío.",
    totalTasks: 2,
  });
});

describe("TaskSummaryButton - NexoTasks", () => {
  it("muestra el destinatario autenticado", () => {
    render(<TaskSummaryButton />);

    expect(
      screen.getByText(/usuario@ejemplo.com/)
    ).toBeInTheDocument();
  });

  it("obtiene un token y solicita el envío", async () => {
    const user = userEvent.setup();

    render(<TaskSummaryButton />);

    await user.click(
      screen.getByRole("button", {
        name: "Enviar resumen por email",
      })
    );

    await waitFor(() => {
      expect(getIdToken).toHaveBeenCalledWith(true);

      expect(sendTaskSummaryEmail).toHaveBeenCalledWith(
        "token-prueba"
      );
    });

    expect(
      await screen.findByRole("status")
    ).toHaveTextContent(
      "AWS SES aceptó la solicitud de envío."
    );
  });

  it("impide enviar si el correo no está verificado", async () => {
    const user = userEvent.setup();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        uid: "user-a",
        email: "usuario@ejemplo.com",
        emailVerified: false,
        getIdToken,
      } as unknown as User,
      loading: false,
    });

    render(<TaskSummaryButton />);

    await user.click(
      screen.getByRole("button", {
        name: "Enviar resumen por email",
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Primero debes verificar tu correo electrónico."
    );

    expect(sendTaskSummaryEmail).not.toHaveBeenCalled();
  });
});
