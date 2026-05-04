import { PencilIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product, onEdit, onDelete, onView }) {
  const [imageError, setImageError] = useState(false);
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      text: "Sin Stock", 
      class: "bg-red-100 text-red-700 border-red-200",
      icon: "❌"
    };
    if (stock < 5) return { 
      text: "Stock Bajo", 
      class: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "⚠️"
    };
    if (stock < 15) return { 
      text: "Stock Medio", 
      class: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "📦"
    };
    return { 
      text: "En Stock", 
      class: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "✓"
    };
  };

  const status = getStockStatus(product.stock);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden">
      <div className="relative">
        {/* Badge de descuento flotante */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        
        {/* Imagen con hover effect */}
        <div className="relative h-48 overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
          <img 
            src={imageError ? "https://via.placeholder.com/400x300?text=Sin+Imagen" : (product.images?.[0] || "https://via.placeholder.com/400x300?text=Producto")}
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          
          {/* Overlay con botón de vista rápida */}
          {onView && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                onClick={() => onView(product)}
                className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <EyeIcon className="w-4 h-4" />
                Ver detalles
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {/* Categoría */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
            {product.category || "Sin categoría"}
          </span>
          
          {/* Badge de stock */}
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${status.class}`}>
            <span>{status.icon}</span>
            <span>{status.text}</span>
          </div>
        </div>
        
        {/* Nombre del producto */}
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 min-h-14">
          {product.name}
        </h3>
        
        {/* Precio y stock */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="font-extrabold text-2xl text-emerald-600">
                  {formatPrice(discountedPrice)}
                </span>
              </div>
            ) : (
              <span className="font-extrabold text-2xl text-emerald-600">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Stock</p>
            <p className="font-bold text-slate-700 text-lg">
              {product.stock} <span className="text-sm font-medium">un.</span>
            </p>
          </div>
        </div>
        
        {/* Barra de progreso de stock */}
        <div className="mb-4">
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                product.stock === 0 ? 'bg-red-500' :
                product.stock < 5 ? 'bg-amber-500' :
                product.stock < 15 ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button 
            className="flex-1 btn btn-sm bg-slate-100 border-slate-200 hover:bg-blue-500 hover:text-white text-slate-600 transition-all duration-200 rounded-lg py-2 flex items-center justify-center gap-2"
            onClick={() => onEdit(product)}
          >
            <PencilIcon className="w-4 h-4" />
            Editar
          </button>
          <button 
            className="flex-1 btn btn-sm bg-red-50 border-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-all duration-200 rounded-lg py-2 flex items-center justify-center gap-2"
            onClick={() => onDelete(product._id)}
          >
            <Trash2Icon className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}