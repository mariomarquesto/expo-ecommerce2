import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom"; // Cambiado de "react-router" a "react-router-dom"

import {
  PanelLeft,
  LayoutDashboard,
  CheckSquare,
  Clock,
  UserCircle,
  Bell
} from "lucide-react";

// eslint-disable-next-line
export const NAVIGATION = [
  { name: "Inicio", path: "/dashboard", icon: <LayoutDashboard className="size-5" /> },
  { name: "Mis Tareas", path: "/tasks", icon: <CheckSquare className="size-5" /> },
  { name: "Asistencia", path: "/attendance", icon: <Clock className="size-5" /> },
  { name: "Mi Perfil", path: "/profile", icon: <UserCircle className="size-5" /> },
];

function Navbar() {
  const location = useLocation();

  const currentPage =
    NAVIGATION.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300 px-4">
      {/* Left */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost btn-circle lg:hidden"
          aria-label="open sidebar"
        >
          <PanelLeft className="size-5" />
        </label>

        <div>
          <h1 className="text-xl font-bold tracking-tight">{currentPage}</h1>
          <p className="text-xs text-base-content/60 italic">Portal del Empleado</p>
        </div>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <span className="indicator-item badge badge-xs badge-secondary animate-pulse"></span>
            <Bell className="size-5" />
          </div>
        </button>

        <div className="divider divider-horizontal mx-1"></div>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 border border-base-300",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;