import { NavLink } from "react-router-dom";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  return (
    <ul className="menu p-4 w-80 min-h-full bg-neutral-900 text-white">
      {/* Título o Logo del Dashboard */}
      <li className="menu-title text-gray-400 text-lg mb-4">Admin Panel</li>
      
      {NAVIGATION.map((item) => (
        <li key={item.name}>
          <NavLink 
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? "bg-primary text-white" : "hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Sidebar;