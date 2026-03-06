import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const router = useRouter();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#f3f706' },
        headerTintColor: '#000',
        headerTitle: 'Mi Tienda',
        // Botón de usuario a la derecha
        headerRight: () => (
          <TouchableOpacity 
            // Usamos 'as any' para silenciar el error de TS mientras se refrescan las rutas
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
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Nuestros Productos',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
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