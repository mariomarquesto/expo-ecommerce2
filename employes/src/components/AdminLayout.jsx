import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      
      {/* 🔴 ESTE INPUT ES OBLIGATORIO */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="p-6 bg-base-200 min-h-screen">
          {children}
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
        ></label>

        <Sidebar />
      </div>
    </div>
  );
}

export default AdminLayout;