import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../services/cartStore'; // Importamos el store

export default function DrawerLayout() {
  const router = useRouter();
  
  // Obtenemos la cantidad total de items (suma de todas las cantidades)
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#f3f706' },
        headerTintColor: '#000',
        headerTitle: 'Mi Tienda',
        drawerActiveTintColor: '#eb0b0b',
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.push('/login' as any)} 
            style={{ marginRight: 15 }}
          >
            <Ionicons name="person-circle-outline" size={32} color="#eb0b0b" />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Nuestros Productos',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />

      {/* CARRITO CON CONTADOR (BADGE) */}
      <Drawer.Screen
        name="cart"
        options={{
          drawerLabel: 'Mi Carrito',
          title: 'Carrito de Compras',
          drawerIcon: ({ color }) => (
            <View>
              <Ionicons name="cart-outline" size={22} color={color} />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalItems > 9 ? '+9' : totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: 'Favoritos',
          drawerIcon: ({ color }) => <Ionicons name="heart-outline" size={22} color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Mi Perfil',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#eb0b0b',
    borderRadius: 9,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});