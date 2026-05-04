// admin/src/pages/NewProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../lib/api';

export default function NewProductPage() {
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

  const createMutation = useMutation({
    mutationFn: (data) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      alert('✅ Producto creado correctamente');
      navigate('/products');
    },
    onError: (error) => {
      console.error('Error al crear:', error);
      alert('❌ Error al crear el producto');
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

    const productData = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      description: form.description,
      discount: parseFloat(form.discount) || 0,
      images: form.images
    };
    
    createMutation.mutate(productData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, images: [e.target.value] }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button 
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Volver a productos
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Nuevo Producto</h1>
          </div>
          <p className="text-emerald-100 text-sm mt-1">Completa los datos del producto</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej: Smart Watch Series 5"
              autoFocus
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0.00"
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0"
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Electrónica, Ropa, etc."
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0"
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
              className="w-full px-4 py-2 border rounded-lg resize-none"
              placeholder="Descripción del producto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL de imagen
            </label>
            <input
              type="text"
              name="images"
              value={form.images[0]}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {form.images[0] && (
              <img 
                src={form.images[0]} 
                alt="Preview" 
                className="mt-2 h-32 w-32 object-cover rounded-lg"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <SaveIcon className="w-5 h-5" />
              {createMutation.isPending ? 'Creando...' : 'Crear Producto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}