// app/index.tsx
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/api';

export default function HomeScreen() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  
  if (error) return <Text style={styles.error}>Error: Asegúrate de que el Backend esté encendido y la IP sea correcta.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#2ecc71', fontSize: 16, marginTop: 5 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 }
});