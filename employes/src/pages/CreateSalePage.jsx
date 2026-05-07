// employes/src/pages/CreateSalePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";

// Configuración de API
const API_URL = "http://localhost:3000/api"; // Cambia por tu URL

const getToken = () => localStorage.getItem("employeeToken");

// API Calls
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/employee/products`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const fetchCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/employee/customers`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Error al cargar clientes");
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/employee/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la orden");
  }

  return response.json();
};

export default function CreateSalePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customerId: "",
    orderItems: [],
    paymentMethod: "cash",
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

  // Cargar productos y clientes
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  // Mutación para crear orden
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("✅ Orden creada correctamente");
      navigate("/sales");
    },
    onError: (error) => {
      console.error("Error:", error);
      alert(`❌ Error al crear la orden: ${error.message}`);
    },
  });

  const addProductToOrder = () => {
    if (!selectedProduct.productId || selectedProduct.quantity < 1) {
      alert("Seleccione un producto y una cantidad válida");
      return;
    }

    const product = products?.find(p => p._id === selectedProduct.productId);
    if (!product) return;

    // Verificar stock
    if (product.stock < selectedProduct.quantity) {
      alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
      return;
    }

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

  const handleCustomerChange = (customerId) => {
    const customer = customers?.find(c => c._id === customerId);
    setForm(prev => ({
      ...prev,
      customerId,
      shippingAddress: {
        fullName: customer?.name || "",
        streetAddress: customer?.address || "",
        city: prev.shippingAddress.city || "",
        state: prev.shippingAddress.state || "",
        zipCode: prev.shippingAddress.zipCode || "",
        phoneNumber: customer?.phone || "",
      },
    }));
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
      clerkId: "employee_created",
      orderItems: form.orderItems.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: {
        fullName: form.shippingAddress.fullName || selectedCustomer?.name || "",
        streetAddress: form.shippingAddress.streetAddress || selectedCustomer?.address || "",
        city: form.shippingAddress.city || "",
        state: form.shippingAddress.state || "",
        zipCode: form.shippingAddress.zipCode || "",
        phoneNumber: form.shippingAddress.phoneNumber || selectedCustomer?.phone || "",
      },
      totalPrice: calculateTotal(),
      paymentMethod: form.paymentMethod,
      status: "pending",
    };

    createOrderMutation.mutate(orderData);
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
          onClick={() => navigate("/sales")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a Ventas
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Nueva Venta / Orden</h1>
            <p className="text-emerald-100 text-sm mt-1">Registrar una nueva orden de venta</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Selección de Cliente */}
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
                <option value="">Seleccionar cliente...</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Dirección de Envío */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dirección de Envío</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nombre completo"
                  value={form.shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Dirección"
                  value={form.shippingAddress.streetAddress}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={form.shippingAddress.city}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Provincia"
                  value={form.shippingAddress.state}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Código Postal"
                  value={form.shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Teléfono"
                  value={form.shippingAddress.phoneNumber}
                  onChange={handleAddressChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta de Crédito/Débito</option>
                <option value="transfer">Transferencia Bancaria</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
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
                  <option value="">Seleccionar producto...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                                      {product.name} - ${product.price} {product.stock !== undefined && `(Stock: ${product.stock})`}
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
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
                                          <td className="py-3 px-4 text-gray-800">${item.price.toFixed(2)}</td>
                                          <td className="py-3 px-4 text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                                          <td className="py-3 px-4 text-center">
                                            <button
                                              type="button"
                                              onClick={() => removeProduct(index)}
                                              className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                              <Trash2Icon className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                      <tr>
                                        <td colSpan="3" className="text-right py-3 px-4 font-semibold text-gray-900">
                                          Total:
                                        </td>
                                        <td className="py-3 px-4 text-lg font-bold text-emerald-600">
                                          ${calculateTotal().toFixed(2)}
                                        </td>
                                        <td></td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-3 pt-4">
                              <button
                                type="submit"
                                disabled={createOrderMutation.isPending}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {createOrderMutation.isPending ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creando...
                                  </div>
                                ) : (
                                  "Crear Venta / Orden"
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate("/sales")}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
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