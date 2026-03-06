import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const router = useRouter();

  return (
    <Drawer
      screenOptions={{
        // --- Estilo del Header ---
        headerStyle: { backgroundColor: '#f3f706' },
        headerTintColor: '#eb0b0b',
        headerTitle: 'Mi Tienda',
        
        // --- Colores Dinámicos del Menú Lateral ---
        drawerActiveTintColor: '#eb0b0b', // Rojo cuando está seleccionado
        drawerInactiveTintColor: '#333',   // Gris oscuro cuando no
        drawerLabelStyle: { fontWeight: '600' },

        // Botón de usuario a la derecha del Header
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.push('/login' as any)} 
            style={{ marginRight: 15 }}
          >
            <View style={styles.userIconContainer}>
              <Ionicons name="person-circle-outline" size={32} color="#eb0b0b" />
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      {/* 1. INICIO */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Nuestros Productos',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />

      {/* 2. CARRITO */}
      <Drawer.Screen
        name="cart"
        options={{
          drawerLabel: 'Mi Carrito',
          title: 'Carrito de Compras',
          drawerIcon: ({ color }) => <Ionicons name="cart-outline" size={22} color={color} />,
        }}
      />

      {/* 3. FAVORITOS */}
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: 'Favoritos',
          title: 'Mis Favoritos',
          drawerIcon: ({ color }) => <Ionicons name="heart-outline" size={22} color={color} />,
        }}
      />

      {/* 4. PERFIL */}
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Mi Perfil',
          title: 'Mi Cuenta',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />

      {/* 5. PEDIDOS */}
      <Drawer.Screen
        name="orders"
        options={{
          drawerLabel: 'Mis Pedidos',
          title: 'Historial',
          drawerIcon: ({ color }) => <Ionicons name="receipt-outline" size={22} color={color} />,
        }}
      />

      {/* 6. CONFIGURACIÓN */}
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Ajustes',
          title: 'Configuración',
          drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  userIconContainer: {
    padding: 5,
  }
});