import React from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Número configurado con el código de país (549 para Argentina)
const WHATSAPP_NUMBER = "5493813471147"; 
const WELCOME_MESSAGE = "¡Hola! Vi un producto en la app y me gustaría más información.";

export default function WhatsAppButton() {
  
  const handlePress = async () => {
    // Generamos el link con el mensaje predefinido
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WELCOME_MESSAGE)}`;
    
    try {
      // Verificamos si la app de WhatsApp está instalada
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        // Abre la aplicación directamente
        await Linking.openURL(url);
      } else {
        // Si no está instalada, abre WhatsApp Web en el navegador
        const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WELCOME_MESSAGE)}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("No se pudo abrir WhatsApp:", error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.fab} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="logo-whatsapp" size={32} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#25D366', // Verde oficial de WhatsApp
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para Android
    elevation: 8,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 9999, // Asegura que flote sobre todo
  },
});