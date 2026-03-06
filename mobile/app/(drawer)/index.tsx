import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchProducts } from "../../services/api";
import { useCartStore } from "../../services/cartStore";

const { width } = Dimensions.get("window");
const cardWidth = (width - 30) / 2;

// --- CONFIGURACIÓN WHATSAPP ---
// Número corregido: 54 (Argentina) 9 (Móvil) 381 (Tucumán) 3471147 (Número)
const WHATSAPP_NUMBER = "5493813471147";

export default function HomeScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  // Se extraen solo las variables necesarias para evitar errores de ESLint (no-unused-vars)
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleWhatsApp = async () => {
    const msg = "Hola! Me gustaría consultar sobre los productos de la App.";
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback para abrir en el navegador si la App de WhatsApp no está instalada
        await Linking.openURL(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        );
      }
    } catch (error) {
      console.error("No se pudo abrir WhatsApp:", error);
    }
  };

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb0b0b" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Cargando catálogo...
        </Text>
      </View>
    );

  if (isError)
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={50} color="#ccc" />
        <Text style={{ color: "#ef4444", fontWeight: "bold", marginTop: 10 }}>
          Error al conectar con el servidor
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: "#eee",
            borderRadius: 8,
          }}
          onPress={() => router.replace("/")}
        >
          <Text>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#faf8f9" }}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }} // Espacio para que el botón no tape productos
          renderItem={({ item }) => {
            const outOfStock = (item.stock || 0) <= 0;

            return (
              <TouchableOpacity
                style={[styles.card, outOfStock && { opacity: 0.7 }]}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${item._id}` as any)}
              >
                <Image
                  source={{
                    uri: item.images?.[0] || "https://via.placeholder.com/150",
                  }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <View style={styles.row}>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text
                      style={[
                        styles.stockBadge,
                        { color: outOfStock ? "#ef4444" : "#10b981" },
                      ]}
                    >
                      {outOfStock ? "Agotado" : `Stock: ${item.stock}`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.btn,
                      outOfStock && { backgroundColor: "#d1d5db" },
                    ]}
                    disabled={outOfStock}
                    onPress={() => {
                      addToCart(item);
                      Alert.alert(
                        "¡Éxito!",
                        `${item.name} añadido al carrito.`,
                      );
                    }}
                  >
                    <Ionicons name="cart-outline" size={16} color="white" />
                    <Text style={styles.btnText}>
                      {" "}
                      {outOfStock ? "Agotado" : "Añadir"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>

      {/* BOTÓN FLOTANTE WHATSAPP (Directo) */}
      <TouchableOpacity
        style={styles.whatsappFab}
        onPress={handleWhatsApp}
        activeOpacity={0.8}
      >
        <Ionicons name="logo-whatsapp" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#ffffff",
    width: cardWidth,
    margin: 5,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  image: { width: "100%", height: 150, backgroundColor: "#f3f4f6" },
  info: { padding: 12 },
  name: { fontWeight: "700", fontSize: 14, color: "#1f2937" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  price: { fontWeight: "900", fontSize: 16, color: "#000" },
  stockBadge: { fontSize: 10, fontWeight: "bold" },
  btn: {
    backgroundColor: "#000",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  whatsappFab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#25D366",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 999,
  },
});
