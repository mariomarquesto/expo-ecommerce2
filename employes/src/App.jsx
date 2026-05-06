// employes/src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Páginas
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MyTasksPage from "./pages/MyTasksPage";
import AttendancePage from "./pages/AttendancePage";
import CustomersPage from "./pages/CustomersPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  // Inicializar estado directamente desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("employeeToken");
    return !!token;
  });
  
  const [employee, setEmployee] = useState(() => {
    const savedEmployee = localStorage.getItem("employee");
    return savedEmployee ? JSON.parse(savedEmployee) : null;
  });

  const handleLogin = (employeeData, token) => {
    localStorage.setItem("employeeToken", token);
    localStorage.setItem("employee", JSON.stringify(employeeData));
    setIsAuthenticated(true);
    setEmployee(employeeData);
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employee");
    setIsAuthenticated(false);
    setEmployee(null);
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
      />

      <Route 
        path="/" 
        element={isAuthenticated ? <DashboardLayout onLogout={handleLogout} employee={employee} /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage employee={employee} />} />
        <Route path="tasks" element={<MyTasksPage employee={employee} />} />
        <Route path="attendance" element={<AttendancePage employee={employee} />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="profile" element={<div className="p-10 font-bold text-gray-900">Mi Perfil - {employee?.name}</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;