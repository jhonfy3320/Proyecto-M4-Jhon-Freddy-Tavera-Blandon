
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { AuthLoading } from "../components/ui/AuthLoading";

export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  // Si tiene sesión, lo enviamos a sus tareas.
  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}
