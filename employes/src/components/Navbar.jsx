// employes/src/components/Navbar.jsx
import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { PanelLeft, Bell } from "lucide-react";
import { NAVIGATION } from "../constants/navigation";

function Navbar() {
  const location = useLocation();
  const currentPage = NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300 px-4">
      <div className="flex items-center gap-2">
        <label htmlFor="my-drawer" className="btn btn-ghost btn-circle lg:hidden">
          <PanelLeft className="size-5" />
        </label>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{currentPage}</h1>
          <p className="text-xs text-base-content/60 italic">Portal del Empleado</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <span className="indicator-item badge badge-xs badge-secondary animate-pulse"></span>
            <Bell className="size-5" />
          </div>
        </button>
        <div className="divider divider-horizontal mx-1"></div>
        <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-base-300" } }} />
      </div>
    </div>
  );
}

export default Navbar;