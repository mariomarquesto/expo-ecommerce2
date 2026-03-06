import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Creamos el cliente para manejar las peticiones a la API
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#eb0b0b" },
          headerTintColor: "#7066cc",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* La pantalla principal se llama index */}
        <Stack.Screen name="index" options={{ title: "Mi Tienda " }} />
      </Stack>
    </QueryClientProvider>
  );
}