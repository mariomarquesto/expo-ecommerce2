import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Layout y Loader
import DashboardLayout from "./layouts/DashboardLayout";
import PageLoader from "./components/PageLoader";

// Páginas de Login
import LoginPage from "./pages/LoginPage";

// Nuevas Páginas de Empleados (Asegúrate de haber creado estos archivos)
import DashboardPage from "./pages/DashboardPage";
import MyTasksPage from "./pages/MyTasksPage";
import AttendancePage from "./pages/AttendancePage";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  // Esperar a que Clerk cargue la sesión
  if (!isLoaded) return <PageLoader />;

  return (
    <Routes>
      {/* Ruta de Login: Si ya está logueado, lo manda al dashboard */}
      <Route 
        path="/login" 
        element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />

      {/* Rutas Protegidas bajo el DashboardLayout */}
      <Route 
        path="/" 
        element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        {/* Redirección automática de la raíz al dashboard */}
        <Route index element={<Navigate to="dashboard" />} />
        
        {/* Vistas del empleado */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tasks" element={<MyTasksPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        
        {/* Perfil (puedes dejarlo como placeholder o crear la página luego) */}
        <Route path="profile" element={<div className="p-10 font-bold">Mi Perfil (En construcción)</div>} />
      </Route>

      {/* Comodín: Si la ruta no existe, vuelve al inicio */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;