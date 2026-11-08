
import { AuthPanel } from "../features/auth/components/AuthPanel";
import type { AuthMode } from "../features/auth/utils/authValidation";

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <main className="main-content">
      <div className="container">
        <AuthPanel key={mode} mode={mode} />
      </div>
    </main>
  );
}
