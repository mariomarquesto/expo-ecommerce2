// admin/src/pages/EditProductPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SaveIcon, ArrowLeftIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../lib/api'; // ← Cambiado a lib/api

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    discount: '',
    images: ['']
  });

  // Cargar producto
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getAll().then(products => 
      products.find(p => p._id === id)
    ),
  });

  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        setForm({
          name: product.name || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          category: product.category || '',
          description: product.description || '',
          discount: product.discount?.toString() || '',
          images: product.images || ['']
        });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [product]);

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data) => productApi.update({ id, formData: data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', id]);
      alert('✅ Producto actualizado correctamente');
      navigate('/products');
    },
    onError: (error) => {
      console.error('Error al actualizar:', error);
      alert('❌ Error al actualizar el producto');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }
    if (parseFloat(form.price) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    if (parseInt(form.stock) < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    const updatedData = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      description: form.description,
      discount: parseFloat(form.discount) || 0,
      images: form.images
    };
    
    updateMutation.mutate(updatedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setForm(prev => ({ ...prev, images: [url] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-600">Producto no encontrado</p>
          <button 
            onClick={() => navigate('/products')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button 
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Volver a productos
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Editar Producto</h1>
          <p className="text-blue-100 text-sm mt-1">Modifica los datos del producto</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                name="discount"
                step="1"
                min="0"
                max="100"
                value={form.discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL de la imagen
            </label>
            <input
              type="text"
              name="images"
              value={form.images[0]}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
            {form.images[0] && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Vista previa:</p>
                <img 
                  src={form.images[0]} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Error+de+imagen';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
            >
              <SaveIcon className="w-5 h-5" />
              {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}