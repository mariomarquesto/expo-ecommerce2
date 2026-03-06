import React from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  Image, TouchableOpacity, Dimensions, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router'; 
// Ajusta estas rutas según tu ubicación real
import { fetchProducts } from '../services/api'; 
import { useCartStore } from '../services/cartStore'; 

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#eb0b0b" />
    </View>
  );

  if (isError) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>No se pudo conectar con el servidor</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const outOfStock = item.stock <= 0;

          return (
            <TouchableOpacity 
              style={[styles.card, outOfStock && { opacity: 0.7 }]} 
              activeOpacity={0.8}
              onPress={() => router.push(`/product/${item._id}` as any)}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={[styles.badge, outOfStock && { backgroundColor: '#666' }]}>
                  <Text style={styles.badgeText}>
                    {outOfStock ? 'AGOTADO' : (item.category || 'Nuevo')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.stockInfo}>Stock: {item.stock}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.buyButton, outOfStock && { backgroundColor: '#ccc' }]}
                  disabled={outOfStock}
                  onPress={(e) => {
                    // Evita que al tocar el botón se abra el detalle
                    addToCart(item);
                    Alert.alert("🛒", `${item.name} añadido.`);
                  }}
                >
                  <Text style={styles.buyButtonText}>
                    {outOfStock ? 'Sin Stock' : 'Añadir'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    margin: 5,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageContainer: { width: '100%', height: 160 },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#eb0b0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  info: { padding: 10 },
  name: { fontSize: 14, fontWeight: '600', color: '#333' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  stockInfo: { fontSize: 10, color: '#666' },
  buyButton: {
    backgroundColor: '#1a1a1a',
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  errorText: { color: 'red', fontWeight: 'bold' }
});