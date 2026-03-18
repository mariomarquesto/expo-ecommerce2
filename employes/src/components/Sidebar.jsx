import { NavLink } from "react-router-dom";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-base-100 border-r border-base-300 flex flex-col">
      {/* Logo Area */}
      <div className="p-6">
        <div className="bg-primary text-primary-content p-3 rounded-xl flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg font-black text-xl">E</div>
          <span className="font-bold tracking-wider uppercase text-sm">Empresas S.A.</span>
        </div>
      </div>

      {/* Menú */}
      <ul className="menu menu-md px-4 flex-1 space-y-1">
        <li className="menu-title text-base-content/40 uppercase text-xs font-bold mt-4 mb-2">Principal</li>
        {NAVIGATION.map((item) => (
          <li key={item.name}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `flex items-center gap-4 py-3 px-4 rounded-xl transition-all ${
                  isActive 
                  ? "bg-primary text-primary-content shadow-md" 
                  : "hover:bg-base-200"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-base-300">
        <div className="bg-base-200 p-4 rounded-xl text-center">
          <p className="text-xs font-bold opacity-50">SOPORTE IT</p>
          <button className="btn btn-link btn-xs no-underline text-primary">ayuda@empresa.com</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;