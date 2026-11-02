
import { CheckCheck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="brand">
          <span className="brand-icon">
            <CheckCheck
              size={24}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </span>

          <span className="brand-name">
            Nexo<span>Tasks</span>
          </span>
        </div>

        <span className="header-project">
          Proyecto Integrador M4
        </span>
      </div>
    </header>
  );
}
