
import { AppHeader } from "./components/layout/AppHeader";
import { HomePage } from "./pages/HomePage";

import "./App.css";


import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { TasksPage } from "./pages/TasksPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <AppHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={<AuthPage mode="login" />}
          />

          <Route
            path="/register"
            element={<AuthPage mode="register" />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/tasks"
            element={<TasksPage />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
