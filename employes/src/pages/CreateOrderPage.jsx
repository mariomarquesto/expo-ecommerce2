// admin/src/pages/CreateOrderPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, orderApi, customerApi } from "../lib/api";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customerId: "",
    orderItems: [],
    shippingAddress: {
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
    },
  });

  const [selectedProduct, setSelectedProduct] = useState({
    productId: "",
    quantity: 1,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const createOrderMutation = useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      alert("✅ Orden creada correctamente");
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Error:", error);
      alert("❌ Error al crear la orden");
    },
  });

  const addProductToOrder = () => {
    if (!selectedProduct.productId || selectedProduct.quantity < 1) {
      alert("Seleccione un producto y una cantidad válida");
      return;
    }

    const product = products?.find(p => p._id === selectedProduct.productId);
    if (!product) return;

    setForm(prev => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: selectedProduct.quantity,
          image: product.images?.[0] || "",
        },
      ],
    }));

    setSelectedProduct({ productId: "", quantity: 1 });
  };

  const removeProduct = (index) => {
    setForm(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return form.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customerId) {
      alert("Seleccione un cliente");
      return;
    }

    if (form.orderItems.length === 0) {
      alert("Agregue al menos un producto");
      return;
    }

    const selectedCustomer = customers?.find(c => c._id === form.customerId);

    const orderData = {
      user: form.customerId,
      clerkId: "admin_created",
      orderItems: form.orderItems,
      shippingAddress: {
        fullName: form.shippingAddress.fullName || selectedCustomer?.name || "",
        streetAddress: form.shippingAddress.streetAddress || selectedCustomer?.address || "",
        city: form.shippingAddress.city || "",
        state: form.shippingAddress.state || "",
        zipCode: form.shippingAddress.zipCode || "",
        phoneNumber: form.shippingAddress.phoneNumber || selectedCustomer?.phone || "",
      },
      totalPrice: calculateTotal(),
      status: "pending",
    };

    createOrderMutation.mutate(orderData);
  };

  const handleAddressChange = (e) => {
    setForm(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers?.find(c => c._id === customerId);
    setForm(prev => ({
      ...prev,
      customerId,
      shippingAddress: {
        fullName: customer?.name || "",
        streetAddress: customer?.address || "",
        phoneNumber: customer?.phone || "",
        city: prev.shippingAddress.city,
        state: prev.shippingAddress.state,
        zipCode: prev.shippingAddress.zipCode,
      },
    }));
  };

  if (productsLoading || customersLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a órdenes
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Nueva Orden</h1>
            <p className="text-emerald-100 text-sm mt-1">Crear una nueva orden manual</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                value={form.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"
                required
              >
                <option value="" className="text-gray-500">Seleccionar cliente...</option>
                {customers?.map((customer) => (
                  <option key={customer._id} value={customer._id} className="text-gray-900">
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Dirección de envío */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dirección de Envío</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nombre completo"
                  value={form.shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Dirección"
                  value={form.shippingAddress.streetAddress}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={form.shippingAddress.city}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Provincia"
                  value={form.shippingAddress.state}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Código Postal"
                  value={form.shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Teléfono"
                  value={form.shippingAddress.phoneNumber}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Productos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
              <div className="flex gap-4">
                <select
                  value={selectedProduct.productId}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, productId: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">Seleccionar producto...</option>
                  {products?.map((product) => (
                    <option key={product._id} value={product._id} className="text-gray-900">
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={selectedProduct.quantity}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  min="1"
                />
                <button
                  type="button"
                  onClick={addProductToOrder}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de productos agregados */}
              {form.orderItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Precio</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subtotal</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.orderItems.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-3 px-4 text-gray-800">{item.name}</td>
                          <td className="py-3 px-4 text-gray-800">{item.quantity}</td>
                          <td className="py-3 px-4 text-gray-800">${item.price}</td>
                          <td className="py-3 px-4 text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeProduct(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 text-right">
              <p className="text-lg font-semibold text-gray-900">
                Total: ${calculateTotal().toFixed(2)}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50"
              >
                {createOrderMutation.isPending ? "Creando..." : "Crear Orden"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}