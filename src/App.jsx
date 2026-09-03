import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Properties from "./pages/Properties";
import Pipeline from "./pages/Pipeline";
import Tasks from "./pages/Tasks";
import CalendarView from "./pages/CalendarView";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="contactos" element={<Contacts />} />
            <Route path="propiedades" element={<Properties />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="tareas" element={<Tasks />} />
            <Route path="calendario" element={<CalendarView />} />
            <Route path="reportes" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
