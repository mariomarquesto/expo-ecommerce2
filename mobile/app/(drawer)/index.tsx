import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router'; 
import { fetchProducts } from '../../services/api'; 
import { useCartStore } from '../../services/cartStore';

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#eb0b0b" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/product/${item._id}` as any)}>
              <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <TouchableOpacity 
                style={styles.buyButton} 
                onPress={() => {
                  addToCart(item);
                  Alert.alert("🛒 Carrito", `${item.name} añadido correctamente.`);
                }}
              >
                <Text style={styles.buyButtonText}>Añadir al carrito</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 10 },
  card: { backgroundColor: '#fff', width: cardWidth, margin: 5, borderRadius: 16, overflow: 'hidden', elevation: 4 },
  image: { width: '100%', height: 160 },
  info: { padding: 10 },
  name: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 4 },
  buyButton: { backgroundColor: '#1a1a1a', marginTop: 10, padding: 8, borderRadius: 8, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});