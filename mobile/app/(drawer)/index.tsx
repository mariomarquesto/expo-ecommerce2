import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import {  SafeAreaView } from 'react-native-safe-area-context';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router'; 
import { fetchProducts } from '../../services/api'; 

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

export default function HomeScreen() {
  const router = useRouter();

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb0b0b" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al conectar con el servidor</Text>
        <Text>{(error as any).message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item._id}` as any)}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ 
                  uri: (item.images && item.images.length > 0) 
                    ? item.images[0] 
                    : 'https://via.placeholder.com/150' 
                }} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category || 'Nuevo'}</Text>
              </View>
            </View>
            
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.rating}>⭐ {item.averageRating || 5}</Text>
              </View>
              <View style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Ver más</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 10 },
  loadingText: { marginTop: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    margin: 5,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  rating: { fontSize: 12, color: '#ffa500' },
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