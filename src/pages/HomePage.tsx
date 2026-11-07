
import {Cloud, Mail, ShieldCheck,} from "lucide-react";
import { FeatureCard } from "../components/ui/FeatureCard";
import { AuthPanel } from "../features/auth/components/AuthPanel";

export function HomePage() {
  return (
    <main className="main-content">
      <div className="container">
        <section className="hero">
          <div className="hero-label">
            PRODUCTIVIDAD SIN COMPLICACIONES
          </div>

          <h1>
            Organiza tu día.
            <span> Alcanza tus objetivos.</span>
          </h1>

          <p className="hero-description">
            NexoTasks te permitirá organizar tus tareas, gestionar tus
            pendientes y mantener el control de tus actividades desde
            cualquier dispositivo.
          </p>

          <div className="development-status">
            <span className="status-dot" />
            Plataforma en desarrollo
          </div>
        </section>

        <AuthPanel />

        <section
          className="features-section"
          aria-labelledby="features-title"
        >
          <div className="section-heading">
            <h2 id="features-title">
              Una forma más simple de trabajar
            </h2>

            <p>
              Estamos construyendo estas funcionalidades para NexoTasks.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={ShieldCheck}
              title="Acceso seguro"
              description="Registro e inicio de sesión para proteger tu información."
            />

            <FeatureCard
              icon={Cloud}
              title="Tareas sincronizadas"
              description="Gestiona tus actividades con almacenamiento en la nube."
            />

            <FeatureCard
              icon={Mail}
              title="Resumen por correo"
              description="Recibe un resumen del estado de tus tareas por email."
            />
          </div>
        </section>
      </div>
    </main>
  );
}