// employes/src/layouts/DashboardLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOutIcon, UserIcon, LayoutDashboard, CheckSquare, Package, Users, ShoppingBag, Clock, UserCircle } from "lucide-react";

function DashboardLayout({ onLogout, employee }) {
  const navigate = useNavigate();
  const location = useLocation();

  const NAVIGATION = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Mis Tareas", path: "/tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { name: "Asistencia", path: "/attendance", icon: <Clock className="w-5 h-5" /> },
    { name: "Clientes", path: "/customers", icon: <Users className="w-5 h-5" /> },
    { name: "Productos", path: "/products", icon: <Package className="w-5 h-5" /> },
    { name: "Órdenes", path: "/orders", icon: <ShoppingBag className="w-5 h-5" /> }, // ← Cambiado
    { name: "Mi Perfil", path: "/profile", icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Portal Empleado</h1>
          <p className="text-xs text-gray-500 mt-1">Sistema Interno</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {NAVIGATION.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{employee?.name || "Empleado"}</p>
                <p className="text-xs text-gray-500 capitalize">{employee?.role || "employee"}</p>
              </div>
            </div>
            <button onClick={onLogout} className="text-red-600 hover:text-red-700">
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;