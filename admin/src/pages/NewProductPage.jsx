// admin/src/pages/NewProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, ArrowLeftIcon, PlusIcon, ImageIcon, TagIcon, DollarSignIcon, PackageIcon, PercentIcon, FileTextIcon } from "lucide-react";
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

  const [imagePreview, setImagePreview] = useState('');

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
    const url = e.target.value;
    setForm(prev => ({ ...prev, images: [url] }));
    setImagePreview(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Botón volver */}
        <button 
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a productos
        </button>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <PlusIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nuevo Producto</h1>
                <p className="text-emerald-100 text-sm mt-1">Completa los datos para agregar un nuevo producto</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <TagIcon className="w-4 h-4 text-emerald-600" />
                Nombre del producto *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                placeholder="Ej: Smart Watch Series 5"
                autoFocus
              />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSignIcon className="w-4 h-4 text-emerald-600" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <PackageIcon className="w-4 h-4 text-emerald-600" />
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Categoría y Descuento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <TagIcon className="w-4 h-4 text-emerald-600" />
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Ej: Electrónica, Ropa, etc."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <PercentIcon className="w-4 h-4 text-emerald-600" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileTextIcon className="w-4 h-4 text-emerald-600" />
                Descripción
              </label>
              <textarea
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 resize-none transition-all"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* URL de imagen */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                URL de la imagen
              </label>
              <input
                type="text"
                name="images"
                value={form.images[0]}
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              
              {/* Vista previa de imagen */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Vista previa:</p>
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-36 w-36 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Error+de+imagen';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <SaveIcon className="w-5 h-5" />
                  {createMutation.isPending ? 'Creando producto...' : 'Crear producto'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}