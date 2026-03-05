import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-auto p-8 bg-neutral-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;