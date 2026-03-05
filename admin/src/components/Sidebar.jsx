import { NavLink } from "react-router-dom";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  return (
<aside className="w-64 min-h-screen bg-gray-900 text-white p-4">     
   <ul className="menu space-y-2">
        {NAVIGATION.map((item) => (
          <li key={item.name}>
            <NavLink to={item.path}>
              {item.icon}
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;