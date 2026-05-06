// employes/src/constants/navigation.js
import { 
  LayoutDashboard, 
  CheckSquare, 
  Package, 
  Users, 
  ShoppingBag, 
  Clock, 
  UserCircle 
} from "lucide-react";

export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Mis Tareas", path: "/tasks", icon: <CheckSquare className="w-5 h-5" /> },
  { name: "Productos", path: "/products", icon: <Package className="w-5 h-5" /> },
  { name: "Clientes", path: "/customers", icon: <Users className="w-5 h-5" /> },
  { name: "Ventas", path: "/sales", icon: <ShoppingBag className="w-5 h-5" /> },
  { name: "Asistencia", path: "/attendance", icon: <Clock className="w-5 h-5" /> },
  { name: "Mi Perfil", path: "/profile", icon: <UserCircle className="w-5 h-5" /> },
];