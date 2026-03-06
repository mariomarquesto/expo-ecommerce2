import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Creamos el cliente de React Query aquí para que esté disponible en toda la app
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* 1. El grupo del Drawer (Contiene Inicio, Perfil, etc.) */}
            <Stack.Screen 
              name="(drawer)" 
              options={{ headerShown: false }} 
            />
            
            {/* 2. El Login (Se abre como un modal deslizante) */}
            <Stack.Screen 
              name="login" 
              options={{ 
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false 
              }} 
            />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}