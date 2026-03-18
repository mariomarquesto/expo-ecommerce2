import { useState } from "react";
import { PlusIcon, XIcon, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "", description: "" });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const queryClient = useQueryClient();

  // 1. Obtener productos con blindaje de datos
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // Si la API devuelve { products: [...] } o solo [...], esto lo captura:
  const products = Array.isArray(data) ? data : (data?.products || []);

  // 2. Mutaciones (Sintaxis TanStack v5)
  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => { closeModal(); queryClient.invalidateQueries({ queryKey: ["products"] }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => productApi.update({ id, formData }),
    onSuccess: () => { closeModal(); queryClient.invalidateQueries({ queryKey: ["products"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  // --- MANEJADORES ---
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images || []);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
    imagePreviews.forEach(url => { if(url.startsWith('blob:')) URL.revokeObjectURL(url); });
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    images.forEach(img => form.append("images", img));

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, formData: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: "", category: "", price: "", stock: "", description: "" });
    setImages([]);
    imagePreviews.forEach(url => { if(url.startsWith('blob:')) URL.revokeObjectURL(url); });
    setImagePreviews([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel de Productos</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary"><PlusIcon className="w-5 h-5"/> Nuevo Producto</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard 
              key={p._id} 
              product={p} 
              onEdit={handleEdit} 
              onDelete={(id) => confirm("¿Borrar producto?") && deleteMutation.mutate(id)} 
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">{editingProduct ? "Editar" : "Crear"} Producto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nombre" className="input input-bordered w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Precio" className="input input-bordered" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <input type="number" placeholder="Stock" className="input input-bordered" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
              </div>
              <textarea className="textarea textarea-bordered w-full" placeholder="Descripción" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <input type="file" multiple className="file-input file-input-bordered w-full" onChange={handleImageChange} required={!editingProduct} />
              <div className="flex gap-2">
                {imagePreviews.map((url, i) => <img key={i} src={url} className="w-20 h-20 object-cover rounded" />)}
              </div>
              <div className="modal-action">
                <button type="button" onClick={closeModal} className="btn">Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}