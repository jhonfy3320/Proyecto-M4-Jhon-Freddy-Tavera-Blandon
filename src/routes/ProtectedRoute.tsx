
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { AuthLoading } from "../components/ui/AuthLoading";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Esperamos la comprobación inicial de Firebase.
  if (loading) {
    return <AuthLoading />;
  }

  // Sin sesión, no permitimos visualizar la ruta.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Con sesión, renderizamos la ruta privada.
  return <Outlet />;
}
