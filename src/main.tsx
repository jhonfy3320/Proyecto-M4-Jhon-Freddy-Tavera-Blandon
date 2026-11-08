//import { firebaseApp } from "./services/firebase/app.ts";
//import { auth } from "./services/firebase/auth";
//import { db } from "./services/firebase/firestore";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
//import App from './App.tsx'


/*if (import.meta.env.DEV) {
  console.info("Firebase SDK:", {
    app: firebaseApp.name,
    authInitialized: auth.app.name === firebaseApp.name,
    firestoreInitialized: db.app.name === firebaseApp.name,
  });
}*/


import App from "./App";
import { AuthProvider } from "./app/providers/AuthProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>
);