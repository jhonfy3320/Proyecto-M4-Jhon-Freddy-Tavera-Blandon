
import { CheckCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export function AppHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link
          to="/"
          className="brand brand-link"
          aria-label="NexoTasks - Ir al inicio"
        >
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
        </Link>

        <div className="header-actions">
          <span className="header-project">
            Proyecto Integrador M4
          </span>

          <nav
            className="header-navigation"
            aria-label="Navegación principal"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Inicio
            </NavLink>

            {loading ? (
              <span className="nav-status" role="status">
                Verificando sesión...
              </span>
            ) : user ? (
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Mis tareas
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Iniciar sesión
                </NavLink>

                <NavLink
                  to="/register"
                  className="nav-link nav-primary"
                >
                  Registrarse
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}