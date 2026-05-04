// admin/src/pages/ProductsPage.jsx (con 's' al final)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() { // ← Nombre del componente
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      alert('✅ Producto eliminado correctamente');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona todos tus productos</p>
        </div>
        <button 
          onClick={handleCreateProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {products?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No hay productos aún</p>
          <button 
            onClick={handleCreateProduct}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Crear el primer producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
