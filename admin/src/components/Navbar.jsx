import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";

import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

// eslint-disable-next-line
export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
  { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
  { name: "Orders", path: "/orders", icon: <ClipboardListIcon className="size-5" /> },
  { name: "Customers", path: "/customers", icon: <UsersIcon className="size-5" /> },
];

function Navbar() {
  const location = useLocation();

  const currentPage =
    NAVIGATION.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300">

      {/* Left */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost btn-circle hover:bg-base-200 transition"
          aria-label="open sidebar"
        >
          <PanelLeftIcon className="size-5" />
        </label>

        <div className="hidden sm:block">
          <h1 className="text-xl font-bold tracking-tight">
            {currentPage}
          </h1>
          <p className="text-xs text-base-content/60">
            Admin panel overview 
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-4 pr-4">

        {/* Optional notification badge placeholder */}
        <button className="btn btn-ghost btn-circle hover:bg-base-200">
          <div className="indicator">
            <span className="indicator-item badge badge-xs badge-primary"></span>
            <span className="text-lg">🔔</span>
          </div>
        </button>

        {/* Clerk User */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;