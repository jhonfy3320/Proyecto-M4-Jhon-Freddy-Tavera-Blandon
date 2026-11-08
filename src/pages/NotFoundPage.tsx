
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="main-content">
      <div className="container">
        <h1>404 — Página no encontrada</h1>
        <p>
          La dirección que buscas no existe
          en NexoTasks.
        </p>
        <Link to="/" className="nav-link">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
