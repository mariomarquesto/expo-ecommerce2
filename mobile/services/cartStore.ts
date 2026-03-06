import { create } from 'zustand';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item._id === product._id);

    if (existingItem) {
      set({
        items: currentItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ items: [...currentItems, { ...product, quantity: 1 }] });
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

  getTotal: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },
}));