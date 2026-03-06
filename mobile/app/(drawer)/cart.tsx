import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCartStore } from '../../services/cartStore';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const { addToCart, removeFromCart } = useCartStore();
  
  // Cálculo del total reactivo
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) return (
    <View style={styles.center}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.empty}>Tu carrito está vacío</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          // Usamos 'stock' que es el nombre real de tu base de datos
          const hasReachedLimit = item.quantity >= (item.stock || 0);

          return (
            <View style={styles.item}>
              <Image source={{ uri: item.images?.[0] }} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                    <Ionicons name="remove-circle-outline" size={28} color="black" />
                  </TouchableOpacity>
                  
                  <Text style={styles.qty}>{item.quantity}</Text>
                  
                  <TouchableOpacity 
                    onPress={() => addToCart(item)}
                    // Ahora comparamos contra item.stock
                    disabled={hasReachedLimit}
                    style={{ opacity: hasReachedLimit ? 0.3 : 1 }}
                  >
                    <Ionicons name="add-circle-outline" size={28} color="black" />
                  </TouchableOpacity>
                </View>

                {hasReachedLimit && (
                  <Text style={styles.limitMsg}>
                    Máximo disponible: {item.stock} unidades
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.total}>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payText}>Pagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: 18, color: '#999', marginTop: 10 },
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  img: { width: 70, height: 70, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  price: { color: '#eb0b0b', fontWeight: 'bold', fontSize: 15, marginVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qty: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  limitMsg: { fontSize: 11, color: '#f39c12', marginTop: 5, fontWeight: '700' },
  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: '#eee', 
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#666' },
  total: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  payBtn: { backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});