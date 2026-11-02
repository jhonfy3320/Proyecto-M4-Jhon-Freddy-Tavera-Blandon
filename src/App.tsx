
import { AppHeader } from "./components/layout/AppHeader";
import { HomePage } from "./pages/HomePage";

import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <HomePage />
    </div>
  );
}

export default App;

