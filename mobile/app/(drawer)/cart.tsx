import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCartStore } from '../../services/cartStore';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const { addToCart, removeFromCart } = useCartStore();
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) return (
    <View style={styles.center}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.empty}>Tu carrito está vacío</Text>
      <Text style={styles.emptySub}>¡Agrega productos para comenzar!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const hasReachedLimit = item.quantity >= (item.stock || 0);
          // Usamos item.price directamente sin descuento para evitar errores
          const currentPrice = item.price;

          return (
            <View style={styles.card}>
              <Image source={{ uri: item.images?.[0] }} style={styles.img} />
              
              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
                </View>

                <View style={styles.actionsContainer}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item._id)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="remove" size={20} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.qty}>{item.quantity}</Text>
                    
                    <TouchableOpacity 
                      onPress={() => addToCart(item)}
                      disabled={hasReachedLimit}
                      style={[styles.qtyBtn, hasReachedLimit && styles.qtyBtnDisabled]}
                    >
                      <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    onPress={() => removeFromCart(item._id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={22} color="#ff4444" />
                  </TouchableOpacity>
                </View>

                {hasReachedLimit && (
                  <View style={styles.limitContainer}>
                    <Ionicons name="alert-circle-outline" size={14} color="#f39c12" />
                    <Text style={styles.limitMsg}>
                      Máximo {item.stock} unidades disponibles
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payText}>Proceder al pago</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  empty: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#666', 
    marginTop: 20 
  },
  emptySub: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center'
  },
  listContent: {
    padding: 15,
    paddingBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  img: { 
    width: 100, 
    height: 100, 
    borderRadius: 12,
    backgroundColor: '#f0f0f0'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  name: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 6,
    lineHeight: 20
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  price: { 
    color: '#eb0b0b', 
    fontWeight: 'bold', 
    fontSize: 18
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden'
  },
  qtyBtn: {
    backgroundColor: '#333',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyBtnDisabled: {
    backgroundColor: '#ccc'
  },
  qty: { 
    marginHorizontal: 15, 
    fontSize: 16, 
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center'
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffdddd'
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8
  },
  limitMsg: { 
    fontSize: 11, 
    color: '#f39c12', 
    fontWeight: '600'
  },
  footer: { 
    padding: 20, 
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20
  },
  totalLabel: { 
    fontSize: 16, 
    color: '#666',
    fontWeight: '500'
  },
  total: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000'
  },
  payBtn: { 
    backgroundColor: '#000', 
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14, 
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  payText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});