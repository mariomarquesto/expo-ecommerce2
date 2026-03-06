import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchProducts } from '../../services/api'; // O una función específica fetchProductById

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Obtenemos los productos y buscamos el específico por ID
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const product = products?.find((p: any) => p._id === id);

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#eb0b0b" />;
  if (!product) return <Text>Producto no encontrado</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Image 
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
        />

        <View style={styles.content}>
          <Text style={styles.category}>{product.category || 'General'}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>

          {/* AQUÍ SE MUESTRA LA DESCRIPCIÓN */}
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.description}>
            {product.description || "Este producto no tiene una descripción disponible actualmente."}
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCart}>
          <Text style={styles.addToCartText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 5 },
  image: { width: '100%', height: 350, resizeMode: 'cover' },
  content: { padding: 20 },
  category: { color: '#eb0b0b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  descriptionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  addToCart: { backgroundColor: '#000', padding: 18, borderRadius: 12, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});