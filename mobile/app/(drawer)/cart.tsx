import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.title}>Tu carrito está vacío</Text>
      <Text style={styles.subtitle}>¡Agregá algunos productos para empezar a comprar!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ir a la tienda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10 },
  button: { backgroundColor: '#eb0b0b', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});