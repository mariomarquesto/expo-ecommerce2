import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../services/api'; 
import { useCartStore } from '../../services/cartStore';

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

export default function HomeScreen() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  if (isLoading) return <ActivityIndicator style={{flex:1}} size="large" color="red" />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => {
          const outOfStock = item.countInStock <= 0;
          return (
            <View style={[styles.card, outOfStock && { opacity: 0.7 }]}>
              <Image source={{ uri: item.images?.[0] }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
                
                {/* Etiqueta de Stock */}
                <Text style={[styles.stockText, { color: outOfStock ? 'red' : '#28a745' }]}>
                  {outOfStock ? 'Agotado' : `Disponibles: ${item.stock}`}
                </Text>

                <TouchableOpacity 
                  style={[styles.btn, outOfStock && { backgroundColor: '#ccc' }]} 
                  disabled={outOfStock}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.btnText}>{outOfStock ? 'Sin Stock' : 'Añadir'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  card: { backgroundColor: '#fff', width: cardWidth, margin: 5, borderRadius: 12, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 140 },
  info: { padding: 10 },
  name: { fontWeight: '600', fontSize: 14 },
  price: { fontWeight: 'bold', fontSize: 16, marginVertical: 2 },
  stockText: { fontSize: 11, fontWeight: 'bold', marginBottom: 5 },
  btn: { backgroundColor: '#000', padding: 8, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});