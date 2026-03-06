import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/api'; // Ajusta la ruta a tu archivo api.ts

export default function HomeScreen() {
  // 1. Usamos React Query para obtener los productos
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // 2. Estado de carga
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb0b0b" />
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  // 3. Estado de error (IP mal configurada, servidor caído, etc.)
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al conectar con el servidor</Text>
        <Text style={{ fontSize: 12 }}>{(error as any).message}</Text>
      </View>
    );
  }

  // 4. Renderizado de la lista
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  info: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#eb0b0b', fontWeight: 'bold' },
  errorText: { color: 'red', fontWeight: 'bold', marginBottom: 5 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' }
});