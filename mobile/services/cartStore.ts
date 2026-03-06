import { create } from 'zustand';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  stock: number; // Cambiado de countInStock a stock
}

interface CartState {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item._id === product._id);
    
    // Usamos product.stock que es como viene de tu base de datos
    const stockAvailable = product.stock ?? 0;

    if (existingItem) {
      if (existingItem.quantity < stockAvailable) {
        set({
          items: currentItems.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      } else {
        alert("Límite de stock alcanzado");
      }
    } else {
      if (stockAvailable > 0) {
        set({ items: [...currentItems, { ...product, quantity: 1 }] });
      } else {
        alert("Producto sin stock disponible");
      }
    }
  },

  removeFromCart: (productId) => {
    const currentItems = get().items;
    const item = currentItems.find(i => i._id === productId);
    
    if (item && item.quantity > 1) {
      set({ items: currentItems.map(i => i._id === productId ? {...i, quantity: i.quantity - 1} : i) });
    } else {
      set({ items: currentItems.filter((i) => i._id !== productId) });
    }
  },

  clearCart: () => set({ items: [] }),
}));