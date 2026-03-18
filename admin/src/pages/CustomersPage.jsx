import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../lib/api";
import { formatDate } from "../lib/utils";

function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Extraemos la info de la API
  const { data, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const allCustomers = data || [];

  // Filtro de búsqueda por nombre o email
  const filteredCustomers = allCustomers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    document.getElementById('edit_modal').showModal();
  };

  if (error) return (
    <div className="p-6 text-error bg-neutral-900 min-h-screen">
      <div className="alert alert-error">Error al conectar con MongoDB: {error.message}</div>
    </div>
  );

  return (
    // Forzamos el tema oscuro para que las letras sean blancas (base-content)
    <div className="p-6 space-y-6 bg-neutral-950 min-h-screen text-base-content" data-theme="dark">
      
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Directorio de Clientes</h1>
          <p className="text-gray-400">Administración de usuarios y envíos</p>
        </div>

        <div className="form-control">
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="input input-bordered bg-neutral-900 border-white/10 text-white w-full md:w-80 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENEDOR DE LA TABLA */}
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* Cabecera con contraste */}
            <thead className="bg-neutral-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="py-4">Cliente</th>
                <th>Contacto</th>
                <th>Dirección</th>
                <th className="text-right">Registro</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <span className="loading loading-dots loading-lg text-primary"></span>
                    <p className="text-sm mt-2 opacity-50">Cargando base de datos...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 opacity-50">No se encontraron clientes.</td>
                </tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-xl w-12 h-12 shadow-lg">
                          <span className="text-xl font-bold">{customer.name?.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white">{customer.name}</div>
                        <div className="text-[10px] opacity-40 font-mono tracking-tighter">ID: {customer._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="text-sm font-medium">{customer.email}</div>
                    <div className="text-xs text-primary">{customer.phone || "Sin Teléfono"}</div>
                  </td>

                  <td className="text-xs max-w-50 truncate opacity-80 italic">
                    {customer.address || "No especificada"}
                  </td>

                  <td className="text-right text-xs opacity-50">
                    {customer.createdAt ? formatDate(customer.createdAt) : "---"}
                  </td>

                  <td className="text-right">
                    <button 
                      onClick={() => handleEditClick(customer)}
                      className="btn btn-square btn-ghost btn-sm hover:bg-primary hover:text-white transition-all"
                      title="Editar Cliente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN - También con data-theme */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle" data-theme="dark">
        <div className="modal-box bg-neutral-900 border border-white/10 shadow-2xl">
          <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Editar Perfil de Cliente
          </h3>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text text-gray-400">Dirección de Entrega</span></label>
                <textarea 
                  className="textarea textarea-bordered bg-neutral-800 border-white/10 text-white h-24 focus:border-primary" 
                  defaultValue={selectedCustomer.address}
                ></textarea>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-gray-400">Teléfono de Contacto</span></label>
                <input 
                  type="text" 
                  className="input input-bordered bg-neutral-800 border-white/10 text-white focus:border-primary" 
                  defaultValue={selectedCustomer.phone} 
                />
              </div>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost border-white/10">Cancelar</button>
              <button className="btn btn-primary px-8">Actualizar Datos</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default CustomersPage;