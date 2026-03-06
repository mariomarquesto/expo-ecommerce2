import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useCartStore } from '../../services/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  
  // Obtenemos los datos y funciones del store
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Cálculo del total reactivo: se recalcula cada vez que 'items' cambie
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Pantalla de estado vacío
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#ccc" />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Parece que aún no has añadido productos.</Text>
        <TouchableOpacity 
          style={styles.shopButton} 
          onPress={() => router.push('/')}
        >
          <Text style={styles.shopButtonText}>Ir a comprar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {/* Imagen del Producto */}
            <Image 
              source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
              style={styles.image} 
            />

            {/* Detalles del Producto */}
            <View style={styles.infoContainer}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
              
              <View style={styles.quantityRow}>
                <TouchableOpacity 
                  onPress={() => removeFromCart(item._id)} 
                  style={styles.qtyBtn}
                >
                  <Ionicons name="remove" size={20} color="#000" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  onPress={() => addToCart(item)} 
                  style={styles.qtyBtn}
                >
                  <Ionicons name="add" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Subtotal por Item */}
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                ${(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer con Resumen de Compra */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => Alert.alert("Procesando", "Aquí conectaríamos con la pasarela de pago.")}
        >
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  // Estilos Carrito Vacío
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
  emptySubtitle: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
  shopButton: { backgroundColor: '#eb0b0b', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginTop: 30 },
  shopButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Estilos de la Lista
  listContent: { padding: 15 },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 12, 
    marginBottom: 12, 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  productPrice: { fontSize: 14, color: '#eb0b0b', marginVertical: 4 },
  
  // Controles de Cantidad
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyBtn: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 5 },
  quantityText: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  
  subtotalContainer: { marginLeft: 10, alignItems: 'flex-end' },
  subtotalText: { fontWeight: 'bold', fontSize: 16, color: '#000' },

  // Footer y Checkout
  footer: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 18, color: '#666' },
  totalAmount: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  checkoutButton: { backgroundColor: '#1a1a1a', padding: 18, borderRadius: 15, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  clearBtn: { marginTop: 15, alignItems: 'center' },
  clearBtnText: { color: '#eb0b0b', fontWeight: '600' }
});