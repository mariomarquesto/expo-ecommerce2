import { PencilIcon, Trash2Icon } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const getStockStatus = (stock) => {
    // Definimos colores de fondo y texto específicos para los badges
    if (stock === 0) return { text: "Sin Stock", class: "bg-red-100 text-red-700 border-red-200" };
    if (stock < 5) return { text: "Stock Bajo", class: "bg-amber-100 text-amber-700 border-amber-200" };
    return { text: "En Stock", class: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  };

  const status = getStockStatus(product.stock);

  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition-all border border-slate-200 mb-4">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar / Imagen */}
          <div className="avatar">
            <div className="w-24 h-24 rounded-xl border border-slate-100">
              <img 
                src={product.images?.[0] || "https://via.placeholder.com/150"} 
                alt={product.name} 
                className="object-cover"
              />
            </div>
          </div>

          {/* Información del Producto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="truncate">
                {/* Nombre en Gris muy oscuro para que se vea sí o sí */}
                <h3 className="font-bold text-lg truncate text-slate-800">
                  {product.name}
                </h3>
                {/* Categoría en azul oscuro */}
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {product.category}
                </p>
              </div>
              
              {/* Badge con colores forzados */}
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.class} whitespace-nowrap uppercase`}>
                {status.text}
              </div>
            </div>
            
            <div className="flex gap-8 mt-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Precio</p>
                {/* Precio en verde fuerte o el color primario de tu marca */}
                <p className="font-extrabold text-xl text-emerald-600">
                  ${product.price}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Stock</p>
                {/* Stock en color sólido */}
                <p className="font-bold text-slate-700 text-lg">
                  {product.stock} <span className="text-sm font-medium">un.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción con colores fijos */}
          <div className="flex flex-col gap-2">
            <button 
              className="btn btn-square btn-sm bg-slate-100 border-slate-200 hover:bg-blue-500 hover:text-white text-slate-600 transition-colors" 
              onClick={() => onEdit(product)}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button 
              className="btn btn-square btn-sm bg-red-50 border-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-colors" 
              onClick={() => onDelete(product._id)}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}