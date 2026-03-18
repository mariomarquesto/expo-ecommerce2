import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="drawer-content flex flex-col bg-base-200">
        <Navbar />
        <main className="p-4 md:p-8 min-h-[calc(100vh-64px)] overflow-auto">
          {/* Aquí se renderizan las páginas: DashboardPage, TasksPage, etc. */}
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  );
}

export default DashboardLayout;