import { PencilIcon, Trash2Icon } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Sin Stock", class: "badge-error" };
    if (stock < 5) return { text: "Stock Bajo", class: "badge-warning" };
    return { text: "En Stock", class: "badge-success" };
  };

  const status = getStockStatus(product.stock);

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-200">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-xl">
              <img 
                src={product.images?.[0] || "https://via.placeholder.com/150"} 
                alt={product.name} 
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="truncate">
                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                <p className="text-xs opacity-60 uppercase tracking-wider">{product.category}</p>
              </div>
              <div className={`badge badge-sm ${status.class} whitespace-nowrap`}>{status.text}</div>
            </div>
            
            <div className="flex gap-6 mt-3">
              <div>
                <p className="text-[10px] uppercase opacity-50">Precio</p>
                <p className="font-bold text-primary">${product.price}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase opacity-50">Stock</p>
                <p className="font-semibold">{product.stock} un.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="btn btn-square btn-sm btn-ghost" onClick={() => onEdit(product)}>
              <PencilIcon className="w-4 h-4" />
            </button>
            <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => onDelete(product._id)}>
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}